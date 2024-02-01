import dotenv from "dotenv"
dotenv.config()

import { 
  Client, 
  Collection, 
  GatewayIntentBits, 
  Partials 
} from "discord.js"
import type { ISlashCommandData } from "./utils"
import Handler from "./handler"
import { QuickDB } from "quick.db"
import { config } from "./config"
import { Logger } from "./utils"

import * as __slashCommands from "./slash-commands"
import * as __events from "./events"

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

export const database = new QuickDB()

// Global Variables
export const slashCommands = new Collection<string, ISlashCommandData>()
export const logdown = Logger.create({
  webhook: config.logging.webhook
})

// Initializing the project
// Handler.addEventsThenLoadIt(client, __events)

client.login(config.BOT_TOKEN).then(async() => {
  await import("./events")
  Handler.addCommandThenLoadIt(client, __slashCommands)
  Handler.keepTheBotOnline()
})