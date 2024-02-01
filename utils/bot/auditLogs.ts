import type { Guild, GuildAuditLogsResolvable } from "discord.js"

export namespace AuditLogs {
  export async function fetchFirstItem(guild: Guild, type: GuildAuditLogsResolvable) {
    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 1,
      type
    })

    return fetchedLogs.entries.first()
  }
}