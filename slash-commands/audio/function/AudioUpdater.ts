import type { CommandInteraction } from "discord.js"
import { audioQueue, playTheAudio } from "../utils"
import { AudioPlayerStatus, type VoiceConnection } from "@discordjs/voice"
import { sendAudioInfoEmbed } from "../utils/embed"

interface IAudioUpdaterOptions {
  interaction: CommandInteraction
  voiceConnection: VoiceConnection
}

export class AudioUpdater {
  constructor(protected options: IAudioUpdaterOptions) {
    console.log('[updater] created')
  }

  /**Continuously playing the audio until there's no more track 
   * in the queue.
   * 
   * @returns *nothing*
   */
  public async update() {
    const { interaction, voiceConnection } = this.options
    const nextTrack = audioQueue.dequeue()
    if (!nextTrack) {
      console.log("there's no track to be played...")
      return 
    }

    const { audio } = nextTrack
    audio.player.on(AudioPlayerStatus.Idle, () => {
      this.update()
    })

    playTheAudio(nextTrack, voiceConnection)

    await sendAudioInfoEmbed(interaction, nextTrack.addedBy, nextTrack.audio.info)
  }
}