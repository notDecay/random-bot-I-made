import { 
  ApplicationCommandType, 
  type Client 
} from "discord.js"
import type { ISlashCommandData } from "../utils"
import { slashCommands } from ".."
import express from 'express'
// ...
import type * as __slashCommands from "../slash-commands"
import type * as __events from "../events"

namespace Handler {
  const arrayOfSlashCommands: ISlashCommandData[] = []

  const NO_DESCRIPTION = '*no description provided*'

  export async function addCommandThenLoadIt(
    client: Client, 
    commandDataList: typeof __slashCommands
  ) {
    for (const command of Object.values(commandDataList)) {
      if (!command.description) {
        log(`/${command.name} missing a description, fallback to "${NO_DESCRIPTION}"`)
        command["description"] = NO_DESCRIPTION
      }

      command["type"] = ApplicationCommandType.ChatInput
      
      slashCommands.set(command.name, command)
      arrayOfSlashCommands.push(command)
    }

    loadSlashCommand(client)
  }

  function loadSlashCommand(client: Client) {
    client.once("ready", async () => {
      const guild = client.guilds.cache.get("1008223626375467139")!

      // Register for a single guild
      await guild.commands.set(arrayOfSlashCommands)
      
      // Register for all the guilds the bot is in
      // await client.application.commands.set(arrayOfSlashCommands)
      log(`Slash command registered :)`)
    })
  }

  function log(randomThings?: string) {
    console.log(`[Command handler] ${randomThings ?? ''}`)
  }

  export function keepTheBotOnline() {
    const app = express()

    app.listen(3000, () => {
      log('Bot is listened at port 3000')
    })

    app.get('/', (request, response) => {
      log('GET: /')
      response.send('hello there :)')
    })
  }
}

export default Handler