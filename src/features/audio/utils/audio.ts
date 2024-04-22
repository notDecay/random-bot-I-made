import type { 
  CommandInteraction 
} from "discord.js"
import { 
  createAudioResource,
  type AudioPlayer, 
  type AudioResource, 
  createAudioPlayer,
  NoSubscriberBehavior,
  type VoiceConnection
} from "@discordjs/voice"
import playdl, { 
  type InfoData, 
  type SoundCloudStream, 
  type YouTubeStream 
} from "play-dl"

export interface IAudioResource {
  addedBy: CommandInteraction["user"]
  audio: {
    player: AudioPlayer
    resource: AudioResource
    info: InfoData
  }
}

const makeAudioError = (code: number, trackUrl: string) => ({ code, trackUrl })
export type AudioError = ReturnType<typeof makeAudioError>

export type AnyAudioResource = IAudioResource 

export namespace Audio {
  // code names
  export const INVALID_TRACK_OR_PLAYLIST = 0
  export const NO_TRACK_LEFT = 2

  export function doesHaveError(
    audioResource: AnyAudioResource | AudioError
  ): audioResource is AudioError {
    return 'code' in audioResource
  }

  export async function createResource(
    trackUrl: string, 
    interaction: CommandInteraction
  ): Promise<AnyAudioResource | AudioError> {
    let stream: YouTubeStream | SoundCloudStream, info: InfoData
    try {
      stream = await playdl.stream(trackUrl)
      info = await playdl.video_basic_info(trackUrl)
    }
    catch(error) {
      return makeAudioError(INVALID_TRACK_OR_PLAYLIST, trackUrl)
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

  export async function play(audioData: IAudioResource, connection: VoiceConnection) {
    const { audio } = audioData
    connection.subscribe(audio.player)
    audio.player.play(audio.resource)
  }
}