import type { GuildMember } from "discord.js"
import { 
  botJoinVoiceChannel,
  isUserOnAVoiceChannel, 
  type SlashCommandFunction
} from "../../../utils"
import {
  type VoiceConnection
} from "@discordjs/voice"
import { _createAudioResource, audioQueue, AudioState } from "../utils"
import { AudioUpdater } from "../function"
import { sendAudioAddedEmbed } from "../utils/embed"

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
  
  let audioData = await _createAudioResource(url, interaction)
  if (!audioData) {
    return interaction.followUp({
      content: 'Your url is invalid',
    })
  }

  audioQueue.enqueue(audioData)
  if (AudioState.state.isFirstTime) {
    currentConnection = botJoinVoiceChannel(member as GuildMember, guild!)
    new AudioUpdater({
      interaction,
      voiceConnection: currentConnection
    }).update()
  }

  if (!AudioState.state.isFirstTime) {
    await sendAudioAddedEmbed(interaction, audioData.audio.info)
  }

  AudioState.save({
    isFirstTime: false
  })
}