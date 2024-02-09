import playdl from 'play-dl'
import {
  createAudioPlayer,
  createAudioResource as _createAudioResource,
  NoSubscriberBehavior,
} from "@discordjs/voice"
import type { CommandInteraction } from 'discord.js'
import { logdown } from '../../..'

export async function createAudioResource(url: string, interaction: CommandInteraction) {
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

export type AudioData = NonNullable<Awaited<ReturnType<typeof createAudioResource>>>