import type { GuildMember } from "discord.js"
import { 
  botJoinVoiceChannel,
  type SlashCommandFunction
} from "../../../utils"
import { 
  Audio,
  AudioState,
  AudioUpdater,
  AudioUpdaterEvent,
  embed
} from "../utils"

interface IAudioPlayCommandOptions {
  url: string
}

export const play: SlashCommandFunction<IAudioPlayCommandOptions> = async({
  interaction
}, itsArguments) => {
  const { member, guild } = interaction
  
  await interaction.deferReply()

  // create an audio resource so the bot can play it.
  // send a invaid url embed if it failed to create
  const { url } = itsArguments
  let audioData = await Audio.createResource(url, interaction)
  if (Audio.doesHaveError(audioData)) {
    return await embed.sendInvalidUrlEmbed(interaction)
  }

  // add it into the queue
  AudioState.queue.enqueue(audioData)

  const currentState = AudioState.get()

  // if you run the command for the first time or there is no track left in the queue,
  // it will initialize neccessary stuff to play the audio like:
  // - the ability to play the next track
  // - control the audio: play, pause, stop
  // - ...
  // else, it will add a track into the queue and send a embed
  // to indicate that the track have been added. That track
  // will gonna be used later on
  if (currentState.isFirstTime) {
    const voiceConnection = botJoinVoiceChannel(member as GuildMember, guild!)
    const audioUpdater = new AudioUpdater({
      voiceConnection: voiceConnection,
      queue: AudioState.queue
    })

    audioUpdater.on(AudioUpdaterEvent.TRACK_START, async (audioData) => {
      await embed.sendAudioInfoEmbed(interaction, audioData.addedBy, audioData.audio.info)
    })

    audioUpdater.on(AudioUpdaterEvent.TRACK_END, async() => {
      await embed.sendNoTrackLeftEmbed(interaction)
    })

    audioUpdater.update()
  }
  else {
    await embed.sendAudioAddedEmbed(interaction, audioData.audio.info)
  }
}