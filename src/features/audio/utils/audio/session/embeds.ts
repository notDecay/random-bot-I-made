import type { APIEmbed, CommandInteraction } from "discord.js"
import type { InfoData } from "play-dl"
import { Color, Icon, formatEmbedDate } from "../../../../../utils"
import { formatUrl } from "../utils"

function extractYoutubeInfo(trackInfo: InfoData) {
  const { url, durationRaw, channel, thumbnails, title } = trackInfo.video_details
  const author = [
    channel?.verified ? Icon.VERIFIED : '',
    formatUrl(channel?.name!, channel?.url!)
  ].join(' ').trim()

  return {
    durationRaw, 
    thumbnailUrl: thumbnails[0].url,
    formatedTitle: formatUrl(title!, url),
    author
  }
}

function createYoutubeInfoEmbed(trackInfo: InfoData, interaction: CommandInteraction): APIEmbed {
  const requestedUser = interaction.user
  const { author, durationRaw, thumbnailUrl, formatedTitle } = extractYoutubeInfo(trackInfo)

  return {
    title: 'Currently playing',
    fields: [
      {
        name: 'This track',
        value: formatedTitle,
        inline: true
      },
      {
        name: `:cd: Has duration of`,
        value: durationRaw,
        inline: true
      },
      {
        name: `:movie_camera: By`,
        value: author,
        inline: true
      },
    ],
    timestamp: formatEmbedDate(),
    color: Color.NO_COLOR,
    footer: {
      text: `Added by ${requestedUser.tag}`,
      icon_url: requestedUser.avatarURL()!
    },
    thumbnail: {
      url: thumbnailUrl
    }
  }
}

function createYoutubeTrackAddedEmbed(trackInfo: InfoData): APIEmbed {
  const { author, formatedTitle } = extractYoutubeInfo(trackInfo)

  return {
    description: `${Icon.YOUTUBE} Track ${formatedTitle} by ${author} has been added.`
  }
}

const embeds = {
  createYoutubeInfoEmbed,
  createYoutubeTrackAddedEmbed
}

export default embeds