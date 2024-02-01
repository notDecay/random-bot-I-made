import { 
  ApplicationCommandOptionType, 
  type CommandInteractionOptionResolver 
} from "discord.js"
import type { ISlashCommandData } from "../../utils"

export default {
  name: "pin",
  description: "-",
  options: [
    {
      name: 'add',
      description: 'Pin a message from this channel',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'message-id',
          description: 'A message id that you want to pin',
          type: ApplicationCommandOptionType.String
        }
      ]
    },
    {
      name: 'remove',
      description: 'Unpin a message from this channel',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'message-id',
          description: 'A message id that you want to unpin',
          type: ApplicationCommandOptionType.String
        }
      ]
    },
  ],
  run: async ({ client, interaction }) => {
    const subCommand = (interaction.options as CommandInteractionOptionResolver).getSubcommand()
    switch (subCommand) {
      case 'add': {
        
      } break
      
      case 'remove': {
        console.log('unpin')
      } break

      default: {
        console.log(`subcommand "${subCommand}" is fallback to default case, did you forgot to add / mis-spelled it?`)
      } break
    }

    await interaction.deferReply({
      ephemeral: true
    })

    interaction.followUp({ 
      content: `okey`
    })
  },
} satisfies ISlashCommandData