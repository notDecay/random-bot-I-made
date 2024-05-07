import type { GuildMember } from "discord.js"
import { 
  botJoinVoiceChannel,
  type SlashCommandFunction
} from "../../../utils"
import { Audio, AudioState, YoutubePlayer } from "../utils"

interface IAudioPlayCommandOptions {
  url: string
}

export const play: SlashCommandFunction<IAudioPlayCommandOptions> = async({
  interaction
}, itsArguments) => {
  const { member, guild } = interaction
  
  await interaction.deferReply()

  const { url } = itsArguments
  AudioState.queue.enqueue(url)

  const currentState = AudioState.get()
  let audioPlayer: Audio
  if (currentState.isFirstTime) {
    const voiceConnection = botJoinVoiceChannel(member as GuildMember, guild!)
    audioPlayer = new Audio(interaction, voiceConnection, AudioState.queue)
    audioPlayer.handler
      .add(new YoutubePlayer())
    audioPlayer.playUtilRanOutOfTrack()

    AudioState.set({
      isFirstTime: false
    })
  }
  else {
    const thisTrack = await audioPlayer!.parseTrack(url)
    if (!thisTrack) return
    thisTrack.handler.onTrackAdded(thisTrack.handler, interaction)
  }
}