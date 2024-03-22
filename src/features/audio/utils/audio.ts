import playdl, { type InfoData } from 'play-dl'
import {
  createAudioPlayer,
  createAudioResource as _createAudioResource,
  NoSubscriberBehavior,
  type VoiceConnection,
  type AudioPlayer,
  type AudioResource,
} from "@discordjs/voice"
import type { CommandInteraction, User } from 'discord.js'

export interface IAudioData {
  /**Information about the audio element including the player, resource, and metadata. */
  audio: {
    player: AudioPlayer
    resource: AudioResource
    info: InfoData
  }
  /**The user who added the audio resource.
   * 
   * In other words: "who added this track?"
   */
  addedBy: User
}

/**Creates an audio resource from a given URL and interaction.
 *
 * @param url the URL of the audio to stream.
 * @param interaction the command interaction.
 * @returns a `Promise` resolves an object containing the audio player, resource, information, and the user who added it,
 * or `null` if there was an error streaming the audio.
 * 
 * @see {@link IAudioData}
 */
export async function createAudioResource(
  url: string, 
  interaction: CommandInteraction
): Promise<IAudioData | null> {
  console.log(`[audio] streaming ${url}...`)
  let stream: Awaited<ReturnType<typeof playdl['stream']>>
  let info: Awaited<ReturnType<typeof playdl['video_basic_info']>>
  try {
    stream = await playdl.stream(url)
    info = await playdl.video_basic_info(url)
  }
  catch(error) {
    return null
  }

  const resource = _createAudioResource(stream.stream, {
    inputType: stream.type
  })

  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play
    }
  })

  return {
    audio: { player, resource, info },
    addedBy: interaction.user
  }
}

/**Plays the provided audio data in the given voice connection.
 * @param audioData  The audio data to play.
 * @param connection The voice connection to use.
 * @returns *nothing*
 * 
 * @see {@link IAudioData}
 */
export function playTheAudio(audioData: IAudioData, connection: VoiceConnection) {
  const { audio } = audioData
  connection.subscribe(audio.player)
  audio.player.play(audio.resource)
}