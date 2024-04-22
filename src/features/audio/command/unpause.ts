import { SlashCommandFunction } from "../../../utils"
import { AudioState } from "../utils"

export const unpause: SlashCommandFunction = async({
  interaction
}) => {
  const currentState = AudioState.get()
  await interaction.deferReply()

  currentState.audioPlayer?.unpause()

  interaction.followUp({
    content: 'Unpaused the current song...'
  })
}