import { SlashCommandFunction } from "../../../utils"
import { currentAudioState } from "../utils"

export const audioUnpause: SlashCommandFunction = async({
  interaction
}) => {
  await interaction.deferReply()

  currentAudioState.audioPlayer?.unpause()

  interaction.followUp({
    content: 'Unpaused the current song...'
  })
}