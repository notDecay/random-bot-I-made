import type { APIEmbed, CommandInteraction, User } from "discord.js"
import type { InfoData } from "play-dl"
import { Color, Embed, Icon } from "../../../utils"

const EMBED_COLOR = Color.NO_COLOR

export function sendAudioInfoEmbed(
  interaction: CommandInteraction, 
  requestedUser: User, 
  audioInfo: InfoData
) {
  const { durationRaw, thumbnails } = audioInfo.video_details
  const { author, trackUrl } = formatUrl(audioInfo)

  const embed: APIEmbed = {
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
    timestamp: Embed.createNewDate(),
    color: EMBED_COLOR,
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

  const embed: APIEmbed = {
    description: `Track ${trackUrl} by ${author} has been added`,
    color: EMBED_COLOR,
  }

  return interaction.followUp({
    embeds: [embed]
  })
}

export function sendNoTrackLeftEmbed(
  interaction: CommandInteraction
) {
  const embed: APIEmbed = {
    description: `There's no track to play...`,
    color: EMBED_COLOR
  }

  return interaction.followUp({
    embeds: [embed]
  })
}

export async function sendInvalidUrl(
  interaction: CommandInteraction
) {
  const embed: APIEmbed = {
    title: `Whoops, I can't play this track`,
    description: [
      `Seems like the url is invalid :(`,
    ].join('\n'),
    timestamp: Embed.createNewDate(),
    color: EMBED_COLOR
  }

  return interaction.followUp({
    embeds: [embed]
  })
}

function formatUrl(audioInfo: InfoData) {
  const { title, url, channel } = audioInfo.video_details
  const formatThis = (name: string, url: string) => `[**${name}**](${url})`

  return {
    trackUrl: formatThis(title!, url),
    author: `${channel?.verified ? Icon.VERIFIED : ''} ${formatThis(channel?.name!, channel?.url!)}`.trim()
  }
}