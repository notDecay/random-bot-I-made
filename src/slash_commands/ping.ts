import { type ISlashCommand, formatEmbedDate, Color } from "../utils"

export const ping = {
  name: 'ping',
  description: 'Check if I am stil alive or not',
  async run({ interaction, client, args }) {
    await interaction.deferReply({
      ephemeral: true
    })

    await interaction.followUp({
      embeds: [{
        title: ':ping_pong: Pong!',
        description: [
          `> - Websocket ping: \` ${client.ws.ping} \` miliseconds`,
          `> - Still quackin' for ${client.uptime ?? 0 / 1000} seconds`,
          `> - Watching <@894899742822252556> until he embarrassed (plz don't ask \*smilly face*)`
        ].join('\n'),
        timestamp: formatEmbedDate(),
        color: Color.NO_COLOR
      }]
    })
  }
} satisfies ISlashCommand