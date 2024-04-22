import { SlashCommandFunction } from "../../../utils"
import { AudioState } from "../utils"

export const audioStop: SlashCommandFunction = async({
  interaction
}) => {
  const currentState = AudioState.get()
  await interaction.deferReply()

  currentState.voiceConnection?.destroy()
  AudioState.forceReset()

  interaction.followUp({
    content: 'The party has been ended'
  })
}