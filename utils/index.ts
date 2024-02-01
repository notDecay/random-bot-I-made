import { 
  type ApplicationCommand, 
  type Client, 
  type ClientEvents, 
  type CommandInteraction 
} from "discord.js"

export interface ISlashCommandOptions {
  client: Client
  interaction: CommandInteraction
  args: string[]
}

type SlashCommand = Pick<ApplicationCommand, 'description' | 'name'> & {
  description?: string
  options?: ApplicationCommand['options']
}

export interface ISlashCommandData extends SlashCommand {
  run: (commandOptions: ISlashCommandOptions) => any
}

export interface IEventData<EventName extends keyof ClientEvents> {
  name: EventName
  run: (...args: ClientEvents[EventName]) => any
}

export type SlashCommandFunction<CommandOptions, ReturnType = any> = 
  (options: ISlashCommandOptions, commandOptions: CommandOptions) => ReturnType

export function sleep(delayInMiliseconds: number = 5) {
  return new Promise(resolve => setTimeout(resolve, delayInMiliseconds))
}

type ErrorStack = {
  stack: string
  message: string
}

export function parseErrorStack(error: Error): ErrorStack {
  const thisError = JSON.stringify(error, Object.getOwnPropertyNames(error))
  return JSON.parse(thisError)
}

export * from "./bot"
export * from "./logging"
export { default as Queue } from "./structure/Queue"