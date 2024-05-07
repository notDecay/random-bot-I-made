import { EventEmitter } from "node:events"
import { Queue } from "../../../../utils"
import { AudioHandler, TrackType } from "./Handler"
import type { CommandInteraction } from "discord.js"
import type { VoiceConnection } from "@discordjs/voice"

type IdentifiedTrackType = {
  trackUrl: string,
  type: TrackType
}

export const enum AudioEvent {
  NO_TRACK_LEFT,
  PAUSE,
  PLAY,
  STOP
}

export interface IAudioEventMap {
  [AudioEvent.NO_TRACK_LEFT]: []
  [AudioEvent.PLAY]: []
  [AudioEvent.PAUSE]: []
  [AudioEvent.STOP]: []
}

export class Audio {
  readonly handler = new AudioHandler()
  protected readonly audioEvent = new EventEmitter<IAudioEventMap>()

  constructor(
    protected readonly interaction: CommandInteraction,
    protected readonly voiceConnection: VoiceConnection,
    protected readonly queue: Queue<string>
  ) {}

  async playUtilRanOutOfTrack() {
    const nextTrackUrl = this.queue.dequeue()
    if (!nextTrackUrl) {
      return 
    }

    const parsedTrackData = await this.parseTrack(
      this.identify(nextTrackUrl)
    )

    if (!parsedTrackData) return
    const { handler, trackData } = parsedTrackData

    this.audioEvent
      .on(AudioEvent.PAUSE, () => handler.pause(trackData, this.interaction))
    //

    handler.play(trackData, this.voiceConnection, this.interaction)
    handler.onDone = () => {
      this.playUtilRanOutOfTrack()
      this.audioEvent.removeAllListeners()
    }
  }

  pause = () => this.audioEvent.emit(AudioEvent.PLAY)

  protected identify(anyTrackUrl: string): IdentifiedTrackType {
    return {
      trackUrl: anyTrackUrl,
      type: TrackType.YOUTUBE
    }
  }

  async parseTrack(anyTrack: string | IdentifiedTrackType) {
    let track = typeof anyTrack === "string" ? this.identify(anyTrack) : anyTrack

    const availableHandler = this.handler.find(track.type)
    if (!availableHandler) {
      return
    }

    try {
      return {
        trackData: await availableHandler.parse(track.trackUrl, this.interaction),
        handler: availableHandler
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }
}