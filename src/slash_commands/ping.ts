import { 
  type ISlashCommand, 
  formatEmbedDate, 
  Color 
} from "../utils"

export const ping = {
  name: 'ping',
  description: 'Check if I am stil alive or not',
  async run({ interaction, client }) {
    await interaction.deferReply({
      ephemeral: true
    })

    const upTimeInMinutes = (client.uptime ?? 0) / 1000 / 60

    await interaction.followUp({
      embeds: [{
        title: ':ping_pong: Pong!',
        description: [
          `> - Websocket ping: \` ${client.ws.ping} \` miliseconds`,
          `> - Being alive for \` ${upTimeInMinutes} \` minutes`,
        ].join('\n'),
        timestamp: formatEmbedDate(),
        color: Color.NO_COLOR
      }]
    })
  }
} satisfies ISlashCommand