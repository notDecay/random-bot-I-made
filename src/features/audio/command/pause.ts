import { SlashCommandFunction } from "../../../utils"
import { currentAudioState } from "../utils"

export const audioPause: SlashCommandFunction = async({
  interaction
}) => {
  await interaction.deferReply()

  currentAudioState.audioPlayer?.pause()

  interaction.followUp({
    content: 'Paused the current song...'
  })
}