import { Queue } from "../../../utils"
import type { AudioData } from "./audio"

interface IAudioState {
  /**Whenever this is the first time the command has been ran
   * @default true
   */
  isFirstTime: boolean
}

/**Responsible for managing current state of the audio session */
export namespace AudioState {
  const DEFAULT_STATE: IAudioState = {
    isFirstTime: true
  } as const

  export let state = { ...DEFAULT_STATE }
  /**Save some new state to the current state, 
   * the old state will be overriten with the new state.
   * @param newState the new state that it need to be updated
   */
  export function save(newState: Partial<IAudioState>) {
    console.log('[audio state] saving audio state')
    console.log(`[audio state] |  last state`, state)
    state = { ...state, ...newState }
    console.log(`[audio state] |  new state`, state)
  }

  /**Force reseting the current audio state to the default state */
  export function forceReset() {
    state = DEFAULT_STATE
    console.log('[audio state] audio state force resetted')
  }

  export function reset() {
    state = {
      ...state,
      isFirstTime: true
    }

    console.log('[audio state] audio state resetted')
  }
}

/**Save the current audio queue the bot has to be played */
export const audioQueue = new Queue<AudioData>()