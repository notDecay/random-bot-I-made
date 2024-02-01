import { Message } from "discord.js"
import { Queue } from "../../../utils"
import type { AudioData } from "./audio"

export namespace AudioState {
  interface IAudioState {
    isFirstTime: boolean
    originalMessage: Message | null
  }

  const DEFAULT_STATE: IAudioState = {
    isFirstTime: true,
    originalMessage: null
  } as const

  export let state = { ...DEFAULT_STATE }

  export function save(newState: Partial<IAudioState>) {
    console.log('[audio] saving audio state')
    console.log(`[audio] |  last state`, state)
    state = { ...state, ...newState }
    console.log(`[audio] |  new state`, state)
  }

  export function forceReset() {
    state = DEFAULT_STATE
  }
}

/**save the current audio queue the bot has to be played */
export const audioQueue = new Queue<AudioData>()