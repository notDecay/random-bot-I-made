import type { CommandInteraction, User } from "discord.js"
import type { InfoData } from "play-dl"
import { Color, formatEmbedDate, Icon } from "../../../utils"

const EMBED_COLOR = Color.NO_COLOR

export function sendAudioInfoEmbed(
  interaction: CommandInteraction, 
  requestedUser: User, 
  audioInfo: InfoData
) {
  const { durationRaw, thumbnails } = audioInfo.video_details
  const { author, trackUrl } = formatUrl(audioInfo)

  return interaction.followUp({
    embeds: [{
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
      timestamp: formatEmbedDate(),
      color: EMBED_COLOR,
      footer: {
        text: `Requested by ${requestedUser.tag}`,
        icon_url: requestedUser.avatarURL()!
      },
      thumbnail: {
        url: thumbnails[0].url
      }
    }]
  })
}

export function sendAudioAddedEmbed(
  interaction: CommandInteraction, 
  audioInfo: InfoData
) {
  const { author, trackUrl } = formatUrl(audioInfo)

  return interaction.followUp({
    embeds: [{
      description: `${Icon.YOUTUBE} Track ${trackUrl} by ${author} has been added`,
      color: EMBED_COLOR,
    }]
  })
}

export function sendNoTrackLeftEmbed(interaction: CommandInteraction) {
  return interaction.followUp({
    embeds: [{
      description: `There's no track to play...`,
      color: EMBED_COLOR
    }]
  })
}

export function sendInvalidUrlEmbed(interaction: CommandInteraction) {
  return interaction.followUp({
    embeds: [{
      title: `Whoops, I can't play this track`,
      description: [
        `Seems like the url is invalid :(`,
      ].join('\n'),
      timestamp: formatEmbedDate(),
      color: EMBED_COLOR
    }]
  })
}

export async function sendNoAudioPlayed(interaction: CommandInteraction) {
  await interaction.deferReply({
    ephemeral: true
  })

  await interaction.followUp({
    content: `Hmm, you haven't played anything yet`
  })
}

/**Formats the URL and author information for an audio track.
 * @param audioInfo the audio info
 * @returns information about the audio track.
 */
function formatUrl(audioInfo: InfoData) {
  const { title, url, channel } = audioInfo.video_details
  const formatThis = (name: string, url: string) => `[**${name}**](${url})`

  return {
    trackUrl: formatThis(title!, url),
    author: `${channel?.verified ? Icon.VERIFIED : ''} ${formatThis(channel?.name!, channel?.url!)}`.trim()
  }
}