import Foundation
import Capacitor
import AVFoundation

@objc(NativePcmMicrophonePlugin)
public class NativePcmMicrophonePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "NativePcmMicrophonePlugin"
    public let jsName = "NativePcmMicrophone"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "start", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise)
    ]

    private let engine = AVAudioEngine()
    private let session = AVAudioSession.sharedInstance()
    private let processingQueue = DispatchQueue(label: "kol.native-pcm-mic")
    private var isRunning = false
    private var requestedSampleRate: Double = 16_000
    private var chunkSamples = 800
    private var pendingSamples: [Int16] = []

    @objc func start(_ call: CAPPluginCall) {
        #if targetEnvironment(simulator)
        call.reject("Native iOS microphone capture is not reliable in the iOS Simulator. Please test on a physical iPhone or let the app fall back to web microphone capture.")
        return
        #else
        let sampleRate = call.getDouble("sampleRate") ?? 16_000
        let chunkSamples = call.getInt("chunkSamples") ?? 800

        requestRecordPermission { granted in
            guard granted else {
                call.reject("Microphone permission was denied. Please enable it in Settings → KOL → Microphone and try again.")
                return
            }

            self.processingQueue.async {
                do {
                    try self.startCapture(sampleRate: sampleRate, chunkSamples: chunkSamples)
                    call.resolve([
                        "started": true,
                        "sampleRate": Int(sampleRate),
                        "chunkSamples": chunkSamples
                    ])
                } catch {
                    call.reject(error.localizedDescription, nil, error)
                }
            }
        }
        #endif
    }

    @objc func stop(_ call: CAPPluginCall) {
        processingQueue.async {
            self.stopCapture()
            call.resolve()
        }
    }

    private func requestRecordPermission(completion: @escaping (Bool) -> Void) {
        if #available(iOS 17.0, *) {
            AVAudioApplication.requestRecordPermission(completionHandler: completion)
        } else {
            session.requestRecordPermission(completion)
        }
    }

    private func startCapture(sampleRate: Double, chunkSamples: Int) throws {
        stopCapture()

        requestedSampleRate = sampleRate
        self.chunkSamples = max(160, chunkSamples)
        pendingSamples.removeAll(keepingCapacity: true)

        // voiceChat mode is optimized for two-way speech streaming and works
        // more reliably with AVAudioEngine.inputNode than .default mode, which
        // sometimes delivers zero-sample buffers on real devices when another
        // audio session (e.g. WKWebView playback) is also active.
        try session.setCategory(.playAndRecord, mode: .voiceChat, options: [.defaultToSpeaker, .allowBluetooth, .allowBluetoothA2DP])
        try session.setPreferredSampleRate(sampleRate)
        try session.setPreferredInputNumberOfChannels(1)
        try session.setPreferredIOBufferDuration(0.02)
        try session.setActive(true, options: [])
        try session.overrideOutputAudioPort(.speaker)

        // Log the negotiated session so we can confirm input is wired up.
        let negotiatedRate = session.sampleRate
        let inputAvailable = session.isInputAvailable
        NSLog("[NativePcmMic] session active: rate=\(negotiatedRate) inputAvailable=\(inputAvailable) inputs=\(session.availableInputs?.count ?? 0)")

        let inputNode = engine.inputNode
        let inputFormat = inputNode.inputFormat(forBus: 0)

        guard inputFormat.sampleRate > 0, inputFormat.channelCount > 0 else {
            throw NSError(domain: "NativePcmMicrophone", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid input audio format from iOS microphone"])
        }

        inputNode.removeTap(onBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 2048, format: inputFormat) { [weak self] buffer, _ in
            self?.processingQueue.async {
                self?.handleInputBuffer(buffer)
            }
        }

        engine.prepare()
        try engine.start()
        isRunning = true
    }

    private func stopCapture() {
        if isRunning {
            engine.inputNode.removeTap(onBus: 0)
            engine.stop()
        }
        isRunning = false
        pendingSamples.removeAll(keepingCapacity: true)
        try? session.setActive(false, options: [.notifyOthersOnDeactivation])
    }

    private func handleInputBuffer(_ buffer: AVAudioPCMBuffer) {
        guard isRunning, buffer.frameLength > 0 else { return }

        let monoSamples = extractMonoSamples(from: buffer)
        guard !monoSamples.isEmpty else { return }

        let resampled = resample(samples: monoSamples, from: buffer.format.sampleRate, to: requestedSampleRate)
        guard !resampled.isEmpty else { return }

        appendSamples(resampled)

        while pendingSamples.count >= chunkSamples {
            let chunk = Array(pendingSamples.prefix(chunkSamples))
            pendingSamples.removeFirst(chunkSamples)
            emitChunk(chunk, sampleRate: Int(requestedSampleRate))
        }
    }

    private func extractMonoSamples(from buffer: AVAudioPCMBuffer) -> [Float] {
        let frameLength = Int(buffer.frameLength)
        let channelCount = max(Int(buffer.format.channelCount), 1)

        if let floatChannelData = buffer.floatChannelData {
            var mono = [Float](repeating: 0, count: frameLength)
            for frame in 0..<frameLength {
                var sum: Float = 0
                for channel in 0..<channelCount {
                    sum += floatChannelData[channel][frame]
                }
                mono[frame] = sum / Float(channelCount)
            }
            return mono
        }

        if let int16ChannelData = buffer.int16ChannelData {
            var mono = [Float](repeating: 0, count: frameLength)
            for frame in 0..<frameLength {
                var sum: Float = 0
                for channel in 0..<channelCount {
                    sum += Float(int16ChannelData[channel][frame]) / 32768.0
                }
                mono[frame] = sum / Float(channelCount)
            }
            return mono
        }

        emitError("Unsupported native microphone buffer format")
        return []
    }

    private func resample(samples: [Float], from sourceSampleRate: Double, to targetSampleRate: Double) -> [Float] {
        guard !samples.isEmpty, sourceSampleRate > 0, targetSampleRate > 0 else { return [] }
        if abs(sourceSampleRate - targetSampleRate) < 0.5 { return samples }

        let ratio = sourceSampleRate / targetSampleRate
        let outputLength = max(1, Int((Double(samples.count) / ratio).rounded()))
        var output = [Float](repeating: 0, count: outputLength)

        for index in 0..<outputLength {
            let sourceIndex = Double(index) * ratio
            let lower = min(Int(floor(sourceIndex)), samples.count - 1)
            let upper = min(lower + 1, samples.count - 1)
            let fraction = Float(sourceIndex - Double(lower))
            output[index] = samples[lower] * (1 - fraction) + samples[upper] * fraction
        }

        return output
    }

    private func appendSamples(_ samples: [Float]) {
        for sample in samples {
            let clamped = max(-1.0, min(1.0, sample))
            let scaled = clamped < 0 ? clamped * 32768.0 : clamped * 32767.0
            let bounded = max(Float(Int16.min), min(Float(Int16.max), scaled.rounded()))
            pendingSamples.append(Int16(bounded))
        }
    }

    private func emitChunk(_ samples: [Int16], sampleRate: Int) {
        if samples.isEmpty { return }

        var peak: Double = 0
        var data = Data(capacity: samples.count * MemoryLayout<Int16>.size)

        for sample in samples {
            let littleEndian = sample.littleEndian
            withUnsafeBytes(of: littleEndian) { data.append(contentsOf: $0) }
            let normalized = abs(Double(sample)) / 32768.0
            if normalized > peak { peak = normalized }
        }

        notifyListeners("pcmChunk", data: [
            "data": data.base64EncodedString(),
            "peak": peak,
            "sampleRate": sampleRate,
            "samples": samples.count
        ])
    }

    private func emitError(_ message: String) {
        notifyListeners("pcmError", data: ["message": message])
    }
}