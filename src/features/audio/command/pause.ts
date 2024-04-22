import type { SlashCommandFunction } from "../../../utils"
import { AudioState } from "../utils"

export const pause: SlashCommandFunction = async({
  interaction
}) => {
  const currentState = AudioState.get()
  await interaction.deferReply()
  currentState.audioPlayer?.pause()

  interaction.followUp({
    content: 'Paused the current song...'
  })
}