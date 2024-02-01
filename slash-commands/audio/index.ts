import { 
  ApplicationCommandOptionType, 
  type CommandInteractionOptionResolver 
} from "discord.js"
import type { 
  ISlashCommandData 
} from "../../utils"
import { audioPlay } from "./command"

export default {
  name: 'audio',
  description: '-',
  options: [
    {
      name: 'play',
      description: 'play a youtube video',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'url',
          description: 'Paste a youtube url that you want to play',
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    },
    {
      name: 'stop',
      description: 'stop the current audio session',
      type: ApplicationCommandOptionType.Subcommand,
    }
  ],
  async run({ interaction, client, args }) {
    const options = (interaction.options as CommandInteractionOptionResolver)
    const slashCommandOptions = { client, interaction, args }

    switch (options.getSubcommand()) {
      case 'play': {
        const url = options.getString('url')!
        audioPlay(slashCommandOptions, {
          url
        })
      } break

      case 'stop': {
        // ...
      } break
    }
  }
} satisfies ISlashCommandData