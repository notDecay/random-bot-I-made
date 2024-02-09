import type { CommandInteraction } from "discord.js"
import { type AudioData, audioQueue } from "../utils"
import { AudioPlayerStatus, type VoiceConnection } from "@discordjs/voice"
import { sleep, type AnyFunction } from "../../../utils"
import audioConfig from "../config"

interface IAudioUpdaterOptions {
  /**The slash command interaction */
  interaction: CommandInteraction
  /**This bot voice connection */
  voiceConnection: VoiceConnection
}

/**Responsible for playing audio and stuff */
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
    console.log("[updater] updating...")

    const { voiceConnection } = this.options
    const nextTrack = audioQueue.dequeue()
    if (!nextTrack) {
      console.log("[updater] there's no track to be played...")
      callEvent(this.onTrackEnd)
      return 
    }

    console.log("[updater] we still have some track to play")

    const { audio } = nextTrack
    audio.player.once(AudioPlayerStatus.Idle, async () => {
      await sleep(audioConfig.timeTilPlayingNextTrackInMiliseconds)
      this.update()
    })

    callEvent(this.onTrackStart, nextTrack)

    this.playTheAudio(nextTrack, voiceConnection)
    console.log("[updater] everything is looking fine :)")
  }

  protected playTheAudio(audioData: AudioData, connection: VoiceConnection) {
    const { audio } = audioData
    connection.subscribe(audio.player)
  
    console.log('[updater] playing it right now...')
    audio.player.play(audio.resource)
  }

  /**Emitted whenever there's no track left to be played
   * @event
   * @note you have to attach this event before the {@link AudioUpdater.update()} call.
   */
  public onTrackEnd: AnyFunction | undefined
  /**Emitted whenever the bot start playing the track 
   * @event
   * @note you have to attach this event before the {@link AudioUpdater.update()} call.
   */
  public onTrackStart: (audioData: AudioData) => any | undefined
}

function callEvent<T extends AnyFunction | undefined>(
  anyEvent: T, 
  ...args: Parameters<NonNullable<T>>
) {
  if (anyEvent) {
    anyEvent(...args)
    console.log('Event', anyEvent.name, 'called')
  }
}