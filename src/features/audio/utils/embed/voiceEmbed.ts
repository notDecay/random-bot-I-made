import type { CommandInteraction } from "discord.js"
import { EMBED_COLOR, formatEmbedDate } from "./utils"

export async function sendUserNotJoinAnyVoiceChannel(
  interaction: CommandInteraction
) {
  await interaction.deferReply({
    ephemeral: true
  })

  interaction.followUp({
    content: "You haven't joined any voice channel yet..."
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