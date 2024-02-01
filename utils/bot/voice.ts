import type { 
  Guild, 
  GuildMember 
} from "discord.js"
import { 
  joinVoiceChannel, 
} from '@discordjs/voice'

export function isUserOnAVoiceChannel(member: GuildMember) {
  return member.voice?.channel !== null
}

export function botJoinVoiceChannel(member: GuildMember, guild: Guild) {
  return joinVoiceChannel({
    channelId: member.voice.channel!.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator
  })
}