import { InfoData } from "play-dl"
import { Color, Icon } from "../../../../utils"

// re-exported to make the imports look more clean
export type { CommandInteraction, User } from "discord.js"
export type { InfoData } from "play-dl"
export { Icon, formatEmbedDate } from "../../../../utils"

export const EMBED_COLOR = Color.NO_COLOR


/**Formats the URL and author information for an audio track.
 * @param audioInfo the audio info
 * @returns information about the audio track.
 */
export function formatUrl(audioInfo: InfoData) {
  const { title, url, channel } = audioInfo.video_details
  const formatThis = (name: string, url: string) => `[**${name}**](${url})`

  return {
    trackUrl: formatThis(title!, url),
    author: `${channel?.verified ? Icon.VERIFIED : ''} ${formatThis(channel?.name!, channel?.url!)}`.trim()
  }
}