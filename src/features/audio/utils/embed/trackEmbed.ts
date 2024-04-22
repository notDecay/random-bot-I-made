import { CommandInteraction, EMBED_COLOR, formatEmbedDate } from "./utils"

export function sendNoTrackLeftEmbed(interaction: CommandInteraction) {
  return interaction.followUp({
    embeds: [{
      description: `There's no track to play...`,
      color: EMBED_COLOR
    }]
  })
}