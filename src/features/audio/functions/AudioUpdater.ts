import type { CommandInteraction } from "discord.js"
import {
  AudioPlayerStatus, 
  type VoiceConnection 
} from "@discordjs/voice"
import { 
  audioQueue, 
  type IAudioData, 
  playTheAudio,
  currentAudioState,
  resetAudioState,
  saveAudioState
} from "../utils"
import { 
  sleep,
} from "../../../utils"
import { EventEmitter } from "node:events"
import audioConfig from "../config"

interface IAudioUpdaterOptions {
  /**The slash command interaction */
  interaction: CommandInteraction
  /**This bot voice connection */
  voiceConnection: VoiceConnection
}

export const enum AudioUpdaterEventName {
  trackStart,
  trackEnd
}

/**Responsible for playing audio and stuff 
 * @extends EventEmitter
 * @class
 */
export class AudioUpdater extends EventEmitter<{
  [AudioUpdaterEventName.trackStart]: [audioData: IAudioData],
  [AudioUpdaterEventName.trackEnd]: []
}> {
  /**Create a new instance of `AudioUpdater`
   * @param options options to create `AudioUpdater`, see {@link IAudioUpdaterOptions}
   * interface for its options.
   */
  constructor(protected readonly options: IAudioUpdaterOptions) {
    super()
    this.log('created')
  }

  /**Updates the audio queue and starts playing the next track if available (by
   * recursivly called itself).
   * 
   * @emits `AudioUpdaterEventName.trackStart` When a new track starts playing.
   * @emits `AudioUpdaterEventName.trackEnd` When there's no more track to play.
   * @returns a `Promise` resolves *nothing*
   * 
   * @see {@link AudioUpdaterEventName}
   */
  public async update() {
    this.log("updating...")

    const { voiceConnection } = this.options
    // get the next track from the queue
    const nextTrack = audioQueue.dequeue()
    if (!nextTrack) {
      // check if the audio state is already reset
      // this is to fix a bug that when you stop the audio, the bot stil emitting
      // the AudioUpdaterEventName.trackEnd event
      if (!currentAudioState.voiceConnection) return
      this.log("there's no track to be played...")

      resetAudioState()
      this.emit(AudioUpdaterEventName.trackEnd)
      return 
    }

    this.log("we still have some track to play")
    // if we still have some track to play, then play it :)
    const audioPlayer = nextTrack.audio.player
    // this is where it did recursivly call the update() method
    audioPlayer.once(AudioPlayerStatus.Idle, async () => {
      await sleep(audioConfig.timeTilPlayingNextTrackInMiliseconds)
      this.update()
    })

    saveAudioState({
      isFirstTime: false,
      voiceConnection,
      audioPlayer
    })

    this.emit(AudioUpdaterEventName.trackStart, nextTrack)
    playTheAudio(nextTrack, voiceConnection)
    this.log("everything is looking fine :)")
  }

  /**Logs a message to the console with a prefix of `[updater]`.
   * @param anyThing anything you want to log.
   * @returns *nothing*
   */
  protected log(...anyThing: any[]) {
    console.log('[updater]', ...anyThing)
  }
}