import { SlashCommandFunction } from "../../../utils"
import { currentAudioState } from "../utils"

export const audioSkip: SlashCommandFunction = async({
  interaction
}) => {
  await interaction.deferReply()

  currentAudioState.audioPlayer?.stop()

  interaction.followUp({
    content: 'Skipping the current song...'
  })
}