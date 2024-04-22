import { 
  formatUrl, 
  type CommandInteraction, 
  type InfoData, 
  type User, 
  Icon, 
  formatEmbedDate, 
  EMBED_COLOR 
} from "./utils"

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

export async function sendNoAudioPlayed(interaction: CommandInteraction) {
  await interaction.deferReply({
    ephemeral: true
  })

  await interaction.followUp({
    content: `Hmm, you haven't played anything yet`
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