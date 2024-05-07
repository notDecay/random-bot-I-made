import type { VoiceConnection } from "@discordjs/voice"
import type { CommandInteraction } from "discord.js"

export const enum TrackType {
  YOUTUBE,
  YOUTUBE_PLAYLIST,
  SPOTIFY,
  SOUNDCLOUD
}

export interface IAudioHandler<AudioResource = unknown> {
  canHandles: TrackType[]
  play(
    thisTrack: AudioResource, 
    voiceConnection: VoiceConnection,
    interaction: CommandInteraction
  ): any
  pause(thisTrack: AudioResource, interaction: CommandInteraction): any
  skip(): any
  parse(trackUrl: string, interaction: CommandInteraction): Promise<AudioResource>
  // ...
  onDone(): any
  onTrackAdded(trackInfo: unknown, interaction: CommandInteraction): any
}

export class AudioHandler {
  protected readonly handlers = {} as Record<TrackType, IAudioHandler>
  add(handler: IAudioHandler) {
    for (const whatItCanHandle of handler.canHandles) {
      this.handlers[whatItCanHandle] = handler
    }

    return this
  }

  find(handlerType: TrackType): IAudioHandler | undefined {
    return this.handlers[handlerType]
  }
}