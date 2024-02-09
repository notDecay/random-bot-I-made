import type { GuildMember } from "discord.js"
import { 
  botJoinVoiceChannel,
  isUserOnAVoiceChannel, 
  type SlashCommandFunction
} from "../../../utils"
import {
  type VoiceConnection
} from "@discordjs/voice"
import { 
  createAudioResource, 
  audioQueue, 
  AudioState, 
  sendAudioAddedEmbed, 
  sendAudioInfoEmbed, 
  sendNoTrackLeftEmbed,
  sendInvalidUrl
} from "../utils"
import { AudioUpdater } from "../function"

interface IAudioPlayCommandOptions {
  url: string
}

let currentConnection: VoiceConnection
export const audioPlay: SlashCommandFunction<IAudioPlayCommandOptions> = async({
  interaction
}, commandOptions) => {
  const { member, guild } = interaction
  if (!isUserOnAVoiceChannel(member as GuildMember)) {
    return interaction.reply({
      content: 'Oops, you\'re not joining any voice channel',
      ephemeral: true
    })
  }

  await interaction.deferReply()

  const { url } = commandOptions
  
  let audioData = await createAudioResource(url, interaction)
  if (!audioData) {
    return await sendInvalidUrl(interaction)
  }

  audioQueue.enqueue(audioData)
  if (AudioState.state.isFirstTime) {
    currentConnection = botJoinVoiceChannel(member as GuildMember, guild!)
    const audioUpdater = new AudioUpdater({
      interaction,
      voiceConnection: currentConnection
    })
    
    audioUpdater.onTrackStart = async(audioData) => {
      await sendAudioInfoEmbed(interaction, audioData.addedBy, audioData.audio.info)
    }
    
    audioUpdater.onTrackEnd = async() => {
      await sendNoTrackLeftEmbed(interaction)
      AudioState.reset()
    }

    audioUpdater.update()
  }

  if (!AudioState.state.isFirstTime) {
    await sendAudioAddedEmbed(interaction, audioData.audio.info)
  }

  AudioState.save({
    isFirstTime: false
  })
}