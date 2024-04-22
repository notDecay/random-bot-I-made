import { EventEmitter } from "node:events"
import { AudioPlayerStatus, type VoiceConnection } from "@discordjs/voice"
// ...
import { AudioState } from "../state"
import { type  IAudioResource, Audio } from "../audio"
import { sleep } from "../../../../utils"

type AudioQueue = typeof AudioState.queue

export interface IAudioUpdaterOptions {
  queue: AudioQueue
  voiceConnection?: VoiceConnection
}

export const enum AudioUpdaterEvent {
  TRACK_START,
  TRACK_END
}

export type AudioUpdaterEventMap = {
  [AudioUpdaterEvent.TRACK_START]: [audioData: IAudioResource],
  [AudioUpdaterEvent.TRACK_END]: []
}

export class AudioUpdater extends EventEmitter<AudioUpdaterEventMap> {
  constructor(protected options: IAudioUpdaterOptions) {
    super()
  }

  public async update(currentQueue = this.options.queue) {
    const { voiceConnection } = this.options

    const nextTrack = currentQueue.dequeue()

    if (!nextTrack || !voiceConnection) {
      AudioState.reset()
      return this.emit(AudioUpdaterEvent.TRACK_END)
    }

    const { audio } = nextTrack
    audio.player.once(AudioPlayerStatus.Idle, async () => {
      await sleep(1000)
      this.update()
    })

    AudioState.set({
      isFirstTime: false,
      voiceConnection,
      audioPlayer: nextTrack.audio.player
    })

    this.emit(AudioUpdaterEvent.TRACK_START, nextTrack)
    Audio.play(nextTrack, voiceConnection)
  }
}