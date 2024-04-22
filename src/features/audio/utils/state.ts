import type { AudioPlayer, VoiceConnection } from "@discordjs/voice"
import type { User } from "discord.js"
import { Queue } from "../../../utils"
import type { AnyAudioResource } from "./audio"

export interface IAudioState {
  host?: User
  voiceConnection?: VoiceConnection
  audioPlayer?: AudioPlayer
  isFirstTime: boolean
}

export type PartialAudioState = Partial<IAudioState>

const DEFAULT_STATE: IAudioState = {
  host: undefined,
  voiceConnection: undefined,
  audioPlayer: undefined,
  isFirstTime: true
}

let currentState = { ...DEFAULT_STATE }

export namespace AudioState {
  export const queue = new Queue<AnyAudioResource>()

  export const get = (): IAudioState => currentState
  export function set(state: PartialAudioState = {}) {
    const oldState = currentState
    currentState = { ...oldState, ...state }
  }

  export function reset() {
    currentState = {
      ...currentState,
      isFirstTime: true
    }
  }

  export function forceReset() {
    currentState = DEFAULT_STATE
    queue.clear()
  }
}