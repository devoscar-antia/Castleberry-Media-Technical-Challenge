import UIKit
import Capacitor
import WebKit
import AVFoundation

class MainViewController: CAPBridgeViewController {
    override open func webViewConfiguration(for instanceConfiguration: InstanceConfiguration) -> WKWebViewConfiguration {
        let configuration = super.webViewConfiguration(for: instanceConfiguration)
        configuration.allowsInlineMediaPlayback = true
        if #available(iOS 10.0, *) {
            configuration.mediaTypesRequiringUserActionForPlayback = []
        }
        return configuration
    }

    override open func capacitorDidLoad() {
        super.capacitorDidLoad()
        bridge?.registerPluginInstance(NativePcmMicrophonePlugin())
        configureAudioSessionForVoiceChat()
        observeAudioRouteChanges()
    }

    /// Configure AVAudioSession for two-way voice (mic + speaker playback simultaneously).
    /// REQUIRED for WKWebView getUserMedia + Web Audio playback to coexist on iOS.
    /// Without this, iOS defaults to .soloAmbient which silently disables mic capture
    /// the moment the assistant starts speaking.
    private func configureAudioSessionForVoiceChat() {
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(
                .playAndRecord,
                mode: .voiceChat,
                options: [.defaultToSpeaker, .allowBluetooth, .allowBluetoothA2DP, .mixWithOthers]
            )
            try session.setActive(true, options: [])
            try session.overrideOutputAudioPort(.speaker)
            NSLog("[KOL] AVAudioSession configured: category=\(session.category) mode=\(session.mode) sampleRate=\(session.sampleRate)")
        } catch {
            NSLog("[KOL] AVAudioSession configuration failed: \(error.localizedDescription)")
        }
    }

    /// Recover mic capture when audio routes change (AirPods connect/disconnect, headphone unplug, etc.).
    /// Without this, switching from speaker→AirPods mid-call often leaves the WKWebView mic silent.
    private func observeAudioRouteChanges() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleRouteChange(_:)),
            name: AVAudioSession.routeChangeNotification,
            object: nil
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleInterruption(_:)),
            name: AVAudioSession.interruptionNotification,
            object: nil
        )
    }

    @objc private func handleRouteChange(_ notification: Notification) {
        guard let userInfo = notification.userInfo,
              let reasonValue = userInfo[AVAudioSessionRouteChangeReasonKey] as? UInt,
              let reason = AVAudioSession.RouteChangeReason(rawValue: reasonValue) else { return }

        NSLog("[KOL] Audio route changed: reason=\(reason.rawValue)")

        // Re-assert the session config after any route change so mic stays captured.
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setActive(true, options: [])
            try session.overrideOutputAudioPort(.speaker)
        } catch {
            NSLog("[KOL] Re-activate session after route change failed: \(error.localizedDescription)")
        }
    }

    @objc private func handleInterruption(_ notification: Notification) {
        guard let userInfo = notification.userInfo,
              let typeValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
              let type = AVAudioSession.InterruptionType(rawValue: typeValue) else { return }

        NSLog("[KOL] Audio interruption: type=\(type.rawValue)")
        if type == .ended {
            // Phone call ended / Siri dismissed — re-arm session so mic resumes.
            let session = AVAudioSession.sharedInstance()
            try? session.setActive(true, options: [])
        }
    }
}
