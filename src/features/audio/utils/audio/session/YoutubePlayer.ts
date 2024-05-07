import type { CommandInteraction } from "discord.js"
import { AudioPlayerStatus, type VoiceConnection } from "@discordjs/voice"
import playdl, { type InfoData } from "play-dl"
// ...
import { type IAudioHandler, TrackType } from "../Handler"
import { createResource, type AudioResource } from "../utils"
import embeds from "./embeds"

export interface IYoutubeResource {
  audio: AudioResource & {
    info: InfoData
  },
  addedBy: CommandInteraction["user"]
}

export class YoutubePlayer implements IAudioHandler<IYoutubeResource> {
  canHandles = [
    TrackType.YOUTUBE,
    TrackType.SOUNDCLOUD
  ]

  play(thisTrack: IYoutubeResource, voiceConnection: VoiceConnection, interaction: CommandInteraction) {
    const { audio } = thisTrack

    voiceConnection.subscribe(audio.player)

    audio.player.play(audio.resource)
    audio.player.once(AudioPlayerStatus.Idle, this.onDone)
    interaction.followUp({
      embeds: [embeds.createYoutubeInfoEmbed(audio.info, interaction)]
    })
  }

  pause(thisTrack: IYoutubeResource, interaction: CommandInteraction) {
    const { audio } = thisTrack
    audio.player.pause()

    interaction.followUp('The current track has been paused')
  }

  skip() {
    // ...
  }

  async parse(trackUrl: string, interaction: CommandInteraction): Promise<IYoutubeResource> {
    const stream = await playdl.stream(trackUrl)
    const trackInfo = await playdl.video_basic_info(trackUrl)
    return {
      addedBy: interaction.user,
      audio: {
        info: trackInfo,
        ...createResource(stream.stream, stream.type)
      }
    }
  }

  onDone = () => null
  onTrackAdded(trackInfo: InfoData, interaction: CommandInteraction) {
    interaction.followUp({
      embeds: [embeds.createYoutubeTrackAddedEmbed(trackInfo)]
    })
  }
} 