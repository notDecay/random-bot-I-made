import type { 
  Guild, 
  GuildMember 
} from "discord.js"
import { 
  joinVoiceChannel, 
} from '@discordjs/voice'

/**Checks whether a Discord guild member is currently connected to a voice channel.
 *
 * @param member The guild member to check.
 * @returns `true` if the member is in a voice channel, `false` otherwise.
 */
export function isUserOnAVoiceChannel(member: GuildMember) {
  return member.voice?.channel !== null
}

/**Attempts to join the voice channel that a Discord guild member is currently in.
 *
 * @param member The guild member whose voice channel to join.
 * @param guild The guild object representing the member's guild.
 * @returns the bot `VoiceConnection`
 */
export function botJoinVoiceChannel(member: GuildMember, guild: Guild) {
  return joinVoiceChannel({
    channelId: member.voice.channel!.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator
  })
}