import type { GuildMember } from "discord.js"
import { 
  botJoinVoiceChannel,
  isUserOnAVoiceChannel, 
  type SlashCommandFunction
} from "../../../utils"
import { 
  createAudioResource, 
  audioQueue, 
  sendAudioAddedEmbed, 
  sendAudioInfoEmbed, 
  sendNoTrackLeftEmbed,
  sendInvalidUrlEmbed,
  currentAudioState
} from "../utils"
import { AudioUpdater, AudioUpdaterEventName } from "../functions"

interface IAudioPlayCommandOptions {
  url: string
}

export const audioPlay: SlashCommandFunction<IAudioPlayCommandOptions> = async({
  interaction
}, itsArguments) => {
  const { member, guild } = interaction
  
  await interaction.deferReply()

  // create an audio resource so the bot can play it.
  // send a invaid url embed if it failed to create
  const { url } = itsArguments
  let audioData = await createAudioResource(url, interaction)
  if (!audioData) {
    return await sendInvalidUrlEmbed(interaction)
  }

  // add it into the queue
  audioQueue.enqueue(audioData)

  // if you run the command for the first time or there is no track left in the queue,
  // it will initialize neccessary stuff to play the audio like:
  // - the ability to play the next track
  // - control the audio: play, pause, stop
  // - ...
  // else, it will add a track into the queue and send a embed
  // to indicate that the track have been added. That track
  // will gonna be used later on
  if (currentAudioState.isFirstTime) {
    const voiceConnection = botJoinVoiceChannel(member as GuildMember, guild!)
    const audioUpdater = new AudioUpdater({
      interaction,
      voiceConnection: voiceConnection
    })

    audioUpdater.on(AudioUpdaterEventName.trackStart, async (audioData) => {
      await sendAudioInfoEmbed(interaction, audioData.addedBy, audioData.audio.info)
    })

    audioUpdater.on(AudioUpdaterEventName.trackEnd, async() => {
      await sendNoTrackLeftEmbed(interaction)
    })

    audioUpdater.update()
  }
  else {
    await sendAudioAddedEmbed(interaction, audioData.audio.info)
  }
}