import type { 
  ApplicationCommand, 
  Client, 
  CommandInteraction, 
  CommandInteractionOptionResolver 
} from "discord.js"

export interface ISlashCommandOptions {
  /**a instance of the Discord's client. */
  client: Client
  /**The interaction object representing the triggered slash command. (command interaction)*/
  interaction: CommandInteraction
  /**An array of string arguments extracted from the slash command invocation. */
  args: string[]
}

/**Type representing the minimal structure of a slash command definition. */
type SlashCommand = Pick<ApplicationCommand, 'description' | 'name'> & {
  /**The description of the slash command. (Optional) */
  description?: string
  /**Options for the slash command. (Optional) */
  options?: ApplicationCommand['options']
}

export interface ISlashCommand extends SlashCommand {
  /**Function to execute when the slash command is triggered.
   * 
   * @param commandOptions The options object containing details about the triggered command.
   * @see {@link ISlashCommandOptions}
   */
  run: (commandOptions: ISlashCommandOptions) => any
}

/**Generic type definition for a slash command function.
 * 
 * Sometime, the logic of a command is too complex to fit into 1 single file,
 * so I made this type helper here :)
 * 
 * ### Example
 * let say that I have this slash command here -> `/greet` take a argument called "message"
 * that has the string type, and somehow it become too complex. 
 * I can split the code into another file
 * ```
 * // command/greet.ts
 * interface IGreetAruguments {
 *   message: string
 * }
 * 
 * export const greetCommand: SlashCommandFunction<IGreetArguments> = async({
 *   interaction
 * }, commandAruguments) => {
 *   interaction.reply({
 *     content: commandArguments.message
 *   })
 * }
 * ```
 * 
 * In the slash command file
 * ```
 * import { 
 *   type CommandInteractionOptionResolver,
 *   ApplicationCommandOptionType
 * } from "discord.js"
 * import { greetCommand } from "./command/greet.ts"
 * 
 * export const greet = {
 *   name: 'greet',
 *   description: '-',
 *   options: [
 *     {
 *       name: 'message',
 *       description: 'some message',
 *       type: ApplicationCommandOptionType.String,
 *     }
 *   ],
 *   async run(commandOptions) {
 *     const options = (commandOptions.interaction.options as CommandInteractionOptionResolver)
 *     greetCommand(commandOptions, {
 *       message: options.getString('message')!
 *     })
 *   }
 * }
 * ```
 * 
 * There's still have some roblox, I still have to update the type for myself (eg.
 * in the example - `IGreetAruguments`) everytime I added a new slash command argument, 
 * which... cause me a bit of pain, agh!
 * 
 * But, it's works, it's works :)
 * 
 * @param options The options object containing details about the triggered command.
 * @param slashCommandArguments Additional command-specific arguments if provided.
 * @template TCommandOptions Optional type for additional command-specific options.
 * @template TReturnType The return type of the slash command function.
 * 
 * @returns The return value of the slash command function.
 * 
 * @see {@link ISlashCommandOptions}
 */
export type SlashCommandFunction<TCommandOptions = undefined, TReturnType = any> = 
  (options: ISlashCommandOptions, slashCommandArguments: TCommandOptions) => TReturnType

export function getOptions(interaction: CommandInteraction) {
  return (interaction.options as CommandInteractionOptionResolver)
}