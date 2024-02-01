import playdl from 'play-dl'
import {
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  type VoiceConnection
} from "@discordjs/voice"
import type { CommandInteraction } from 'discord.js'
import { logdown } from '../../..'

export async function _createAudioResource(url: string, interaction: CommandInteraction) {
  console.log(`[audio] streaming ${url}...`)
  let stream: Awaited<ReturnType<typeof playdl['stream']>>
  let info: Awaited<ReturnType<typeof playdl['video_basic_info']>>
  try {
    stream = await playdl.stream(url)
    info = await playdl.video_basic_info(url)
  }
  catch(error) {
    logdown.log(error)
    return null
  }

  const resource = createAudioResource(stream.stream, {
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

export type AudioData = NonNullable<Awaited<ReturnType<typeof _createAudioResource>>>

export function playTheAudio(audioData: AudioData, connection: VoiceConnection) {
  const { audio } = audioData
  connection.subscribe(audio.player)

  console.log('[audio] playing it right now...')
  audio.player.play(audio.resource)
}