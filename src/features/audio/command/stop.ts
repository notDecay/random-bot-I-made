import { SlashCommandFunction } from "../../../utils"
import { currentAudioState, forceResetAudioState } from "../utils"

export const audioStop: SlashCommandFunction = async({
  interaction
}) => {
  if (!currentAudioState.voiceConnection) return
  await interaction.deferReply()

  interaction.followUp({
    content: 'The party has been ended'
  })

  currentAudioState.voiceConnection?.destroy()
  forceResetAudioState()
}