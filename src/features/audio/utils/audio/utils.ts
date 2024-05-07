import { 
  createAudioPlayer, 
  createAudioResource, 
  NoSubscriberBehavior, 
  type StreamType 
} from "@discordjs/voice"
import type internal from "stream"

export const isYoutubeLink = (trackUrl: string) =>
    trackUrl.includes('youtube.com')
  
export const isYoutubePlaylist = (trackUrl: string) =>
  isYoutubeLink(trackUrl) && trackUrl.includes('playlist')

export function createResource(stream: internal.Readable, streamType: StreamType) {
  const resource = createAudioResource(stream, {
    inputType: streamType
  })

  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play
    }
  })

  return {
    resource,
    player
  }
}

export type AudioResource = ReturnType<typeof createResource>

export const formatUrl = (name: string, anyUrl: string) => `[**${name}**](${anyUrl})` as const