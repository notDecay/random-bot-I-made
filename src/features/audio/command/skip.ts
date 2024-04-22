import { SlashCommandFunction } from "../../../utils"
import { AudioState } from "../utils"

export const audioSkip: SlashCommandFunction = async({
  interaction
}) => {
  const currentState = AudioState.get()
  await interaction.deferReply()

  currentState.audioPlayer?.stop()

  interaction.followUp({
    content: 'Skipping the current song...'
  })
}