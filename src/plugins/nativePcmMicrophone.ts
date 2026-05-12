import { registerPlugin, type PluginListenerHandle } from "@capacitor/core";

export interface NativePcmMicrophoneStartOptions {
  sampleRate?: number;
  chunkSamples?: number;
}

export interface NativePcmMicrophoneStartResult {
  started: boolean;
  sampleRate: number;
  chunkSamples: number;
}

export interface NativePcmChunkEvent {
  data: string;
  peak: number;
  sampleRate: number;
  samples: number;
}

export interface NativePcmErrorEvent {
  message: string;
}

export interface NativePcmMicrophonePlugin {
  start(options?: NativePcmMicrophoneStartOptions): Promise<NativePcmMicrophoneStartResult>;
  stop(): Promise<void>;
  addListener(
    eventName: "pcmChunk",
    listenerFunc: (event: NativePcmChunkEvent) => void,
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: "pcmError",
    listenerFunc: (event: NativePcmErrorEvent) => void,
  ): Promise<PluginListenerHandle>;
  removeAllListeners(): Promise<void>;
}

export const NativePcmMicrophone = registerPlugin<NativePcmMicrophonePlugin>("NativePcmMicrophone");