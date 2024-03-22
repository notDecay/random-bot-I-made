import { 
  type ApplicationCommandDataResolvable,
  ApplicationCommandType,
  Interaction,
  ApplicationCommandOptionType, 
} from "discord.js"
import { parseErrorStack, type ISlashCommand } from "../utils"
import { client, slashCommands } from ".."

/**A namespace used for handling command related stuff eg. loading, running, error handling.
 * @namespace
 */
namespace Duck {
  const arrayOfSlashCommands: ISlashCommand[] = []

  const NO_DESCRIPTION = '*no description provided*'
  /**Registers a list of slash commands and then loads them into the server with the specified
   * `guildId`.
   * @param guildId a valid server guild id, if it could not find the guild id,
   * a message would be logged into the console indicate that it could not find the guild id.
   * @param commandDataList An object containing the slash commands to be registered.
   * Keys are the command names, values are the corresponding slash command objects.
   * 
   * Each slash command object can have these following properties:
   * - `name`: the name of the slash command.
   * - `description`: A short description of the slash command.
   *   if you somehow forget to give a description of your command,
   *   a warning will be logged into the console. Following that, the default fallback description will be used, 
   *   which it's `"*no description provided*"`
   * - `options`: a optional property to set the slash command's arguments.
   * 
   * @returns a `Promise` resolves *nothing* when the slash commands have been loaded.
   */
  export async function addCommandThenLoadIt(
    guildId: string | undefined,
    commandDataList: Record<string, ISlashCommand>
  ) {
    if (!guildId) {
      return log(`Cannot find the server id`)
    }
    
    for (const command of Object.values(commandDataList)) {
      if (!command.description) {
        log(`/${command.name} missing a required property "description", fallback to "${NO_DESCRIPTION}"`)
        command["description"] = NO_DESCRIPTION
      }

      command["type"] = ApplicationCommandType.ChatInput
      
      slashCommands.set(command.name, command)
      arrayOfSlashCommands.push(command)
    }

    log(`Loading the slash commands rightttt now!`)
    client.once("ready", async () => {
      const guild = client.guilds.cache.get(guildId)
      if (!guild) {
        return log(`Cannot find the specified server id:`, guildId)
      }

      // Register for a single guild
      await guild.commands.set(arrayOfSlashCommands as ApplicationCommandDataResolvable[])
      
      log(`Slash command registered, looking great :)`)
      log(`registered ${arrayOfSlashCommands.length} command(s)`)
    })
  }

  const UNEXPECTED_MESSAGE = "Well this is awkward... Something had gone terribly wrong..." 
  /**Handles *only* the execution of a slash command. Handling error
   * when something is gone terribly wrong.
   * @param interaction the interaction object representing the slash command.
   *
   * @returns a `Promise` that resolves *nothing* when the command has been handled.
   */
  export async function handleRunningSlashCommand(interaction: Interaction) {
    if (!interaction.isCommand()) return
    // retrieves the command object associated with the invoked command name.
    const currentCommand = slashCommands.get(interaction.commandName)
    // Handles cases where the command is not found.
    if (!currentCommand) {
      await interaction.deferReply({
        ephemeral: true
      })

      return void interaction.followUp({ 
        content: UNEXPECTED_MESSAGE
      })
    }

    // Collects arguments provided for the command.
    const itsArgs: string[] = []
    for (const option of interaction.options.data) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        // rename it so it could not confuse myself :)
        const subcommandOption = option
        if (subcommandOption.name) {
          itsArgs.push(subcommandOption.name)
        }

        if (!subcommandOption.options) continue

        for (const itsOption of subcommandOption.options) {
          if (itsOption.value) itsArgs.push(itsOption.value as string)
        }
      }
      if (option.value) {
        itsArgs.push(option.value as string)
      }
    }

    // Sets the `member` property of the interaction object for compatibility.
    // @ts-ignore  oh come on! it DOES work >-< 
    interaction.member = interaction.guild.members.cache.get(interaction.user.id)

    // Attempts to run the command, handling potential errors.
    // eg. Error related to Interaction
    try {
      currentCommand.run({ client, interaction, args: itsArgs })
    } catch (error) {
      console.error(error)
      let replyIt
      if (interaction.replied || interaction.deferred) {
        replyIt = interaction.followUp
      } else {
        replyIt = interaction.reply
      }

      const errorStack = parseErrorStack(error)
      await replyIt({ 
        content: `There was an error while executing this command!\n\`\`\`${errorStack.message}\n${errorStack.stack}\`\`\``, 
        ephemeral: true 
      })
    }
  }

  /**Logs any provided values to the console, prefixed with `[Command handler]`.
   * @param anything Any number of values to be logged.
   * @returns *nothing*
   * @private
   */
  function log(...anything: any[]) {
    console.log(`[Command handler]`, ...anything)
  }
}

export default Duck