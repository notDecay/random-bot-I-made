import type { ISlashCommandData } from "../../utils"

export default {
  name: "ping",
  description: "returns websocket ping",
  run: async ({ client, interaction, args }) => {
    await interaction.deferReply()
    interaction.followUp({ 
      content: `${client.ws.ping}ms!` 
    })
  },
} satisfies ISlashCommandData