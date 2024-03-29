import { 
  ApplicationCommandOptionType, 
  type GuildMember, 
  type CommandInteractionOptionResolver 
} from "discord.js"
import { 
  isUserOnAVoiceChannel,
  type ISlashCommand 
} from "../utils"
import { 
  audioPause, 
  audioPlay, 
  audioSkip, 
  audioStop, 
  audioUnpause, 
  isAudioPlayed,
  sendNoAudioPlayed
} from "../features/audio"

export const audio = {
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
      description: 'Stop the current audio session and make the bot leave the voice',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'skip',
      description: 'Skip the current audio session and play the next one',
      type: ApplicationCommandOptionType.Subcommand
    },
    {
      name: 'pause',
      description: 'Pause the current audio session',
      type: ApplicationCommandOptionType.Subcommand
    },
    {
      name: 'unpause',
      description: 'Unpause the current audio session',
      type: ApplicationCommandOptionType.Subcommand
    }
  ],
  async run({ interaction, client, args }) {
    if (!isUserOnAVoiceChannel(interaction.member as GuildMember)) {
      return interaction.reply({
        content: 'Oops, you\'re not joining any voice channel',
        ephemeral: true
      })
    }
    
    const options = (interaction.options as CommandInteractionOptionResolver)
    const commandOptions = { interaction, client, args }
    const subCommand = options.getSubcommand()

    if (subCommand === 'play') {
      const url = options.getString('url')!
      audioPlay(commandOptions, {
        url
      })

      return
    }

    if (!isAudioPlayed()) {
      return await sendNoAudioPlayed(interaction)
    }
    const theCommand = {
      'stop': audioStop,
      'skip': audioSkip,
      'pause': audioPause,
      'unpause': audioUnpause
    }

    theCommand[subCommand](commandOptions, undefined)
  }
} satisfies ISlashCommand