import dotenv from "dotenv"
dotenv.config()

import { 
  Client, 
  Collection, 
  GatewayIntentBits, 
  Partials 
} from "discord.js"
import type { ISlashCommand } from "./utils"
import Duck from "./handler"

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration
  ],
  partials: [
    Partials.Message,
    Partials.Reaction,
    Partials.Channel,
    Partials.User
  ]
})

// Global Variables
export const slashCommands = new Collection<string, ISlashCommand>()

// Initializing the project
// Handler.addEventsThenLoadIt(client, __events)

client.login(process.env['BOT_TOKEN']).then(async() => {
  await import('./events')
  // Duck.addCommandThenLoadIt('1008223626375467139', __slashCommands)
  Duck.addCommandThenLoadIt(process.env['CURRENT_GUILD_ID'], await import('./slash_commands'))
})