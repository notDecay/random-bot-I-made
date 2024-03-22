import type { AudioPlayer, VoiceConnection } from "@discordjs/voice"
import { Queue } from "../../../utils"
import type { IAudioData } from "./audio"

/**Interface representing the current audio state of the application.*/
interface IAudioState {
  /**Whenever this is the first time the command has been ran
   * @default true
   */
  isFirstTime: boolean
  /**The current bot voice connection
   * @default undefined
   */
  voiceConnection: VoiceConnection
  /**The audio player object */
  audioPlayer: AudioPlayer
}

/**The default initial state of the audio. */
const DEFAULT_STATE: Partial<IAudioState> = {
  isFirstTime: true,
  voiceConnection: undefined,
  audioPlayer: undefined
} as const

/**The current audio state of the application.
 * 
 * And... you should not accidentally override its state somewhere in the code.
 * Use the provided methods to update it. :)
 * 
 * Like...: 
 * - {@link saveAudioState()}: save the new state
 * - {@link resetAudioState()}: soft reset the audio state
 * - {@link forceResetAudioState()}: reset the audio state completely to its default state
 */
export let currentAudioState = { ...DEFAULT_STATE }

/**Saves the updated audio state. This will overrite the old state.
 * 
 * @param newState An object containing the partial changes to be applied to the state.
 * @see {@link IAudioState}
 */
export function saveAudioState(newState: Partial<IAudioState>) {
  log('saving audio state')
  log(`|  last state`, currentAudioState)
  currentAudioState = { ...currentAudioState, ...newState }
  log(`|  new state`, currentAudioState)
}

/**Force resets the audio state completely to the default state and clears the audio queue.
 * @returns *nothing*
 */
export function forceResetAudioState() {
  currentAudioState = DEFAULT_STATE
  log('audio state force resetted')
  audioQueue.clear()
}

/**Soft reset the current audio state
 * @returns *nothing*
 */
export function resetAudioState() {
  currentAudioState = {
    ...currentAudioState,
    isFirstTime: true
  }

  log('audio state resetted')
}

function log(...anything: any[]) {
  console.log(`[audio state]`, ...anything)
}

/**A queue to store audio data to be played by the bot. */
export const audioQueue = new Queue<IAudioData>()

/**Checks if any audio is currently being played by the bot.
 * 
 * @returns true if audio is playing, false otherwise.
 */
export function isAudioPlayed() {
  return currentAudioState.audioPlayer !== undefined
}