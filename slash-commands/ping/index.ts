import type { ISlashCommandData } from "../../utils"

export default {
  name: "ping",
  description: "returns websocket ping",
  run: async ({ client, interaction }) => {
    await interaction.deferReply()
    interaction.followUp({ 
      content: `Ping: ${client.ws.ping}ms!` 
    })
  },
} satisfies ISlashCommandData