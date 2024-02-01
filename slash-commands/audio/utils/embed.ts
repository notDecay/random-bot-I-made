import type { CommandInteraction, MessageEmbedOptions, User } from "discord.js"
import type { InfoData } from "play-dl"
import { Color, Icon } from "../../../utils"

export function sendAudioInfoEmbed(
  interaction: CommandInteraction, 
  requestedUser: User, 
  audioInfo: InfoData
) {
  const { durationRaw, thumbnails } = audioInfo.video_details
  const { author, trackUrl } = formatUrl(audioInfo)

  const embed: MessageEmbedOptions = {
    title: 'Start playing',
    fields: [
      {
        name: `${Icon.YOUTUBE} This track`,
        value: trackUrl,
        inline: true
      },
      {
        name: `:movie_camera: By`,
        value: author,
        inline: true
      },
      {
        name: `:cd: Has duration of`,
        value: durationRaw,
        inline: true
      }
    ],
    timestamp: new Date().toISOString(),
    color: Color.NO_COLOR,
    footer: {
      text: `Requested by ${requestedUser.tag}`,
      icon_url: requestedUser.avatarURL()!
    },
    thumbnail: {
      url: thumbnails[0].url
    }
  }

  return interaction.followUp({
    embeds: [embed]
  })
}

export function sendAudioAddedEmbed(
  interaction: CommandInteraction, 
  audioInfo: InfoData
) {
  const { author, trackUrl } = formatUrl(audioInfo)

  const embed: MessageEmbedOptions = {
    description: `Track ${trackUrl} by ${author} has been added`,
    timestamp: new Date().toISOString(),
    color: Color.NO_COLOR,
  }

  return interaction.followUp({
    embeds: [embed]
  })
}

function formatUrl(audioInfo: InfoData) {
  const { title, url, channel } = audioInfo.video_details
  const _formatUrl = (name: string, url: string) => `[**${name}**](${url})`

  return {
    trackUrl: _formatUrl(title!, url),
    author: `${channel?.verified ? Icon.VERIFIED : ''} ${_formatUrl(channel?.name!, channel?.url!)}`.trim()
  }
}