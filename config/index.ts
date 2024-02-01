import { botConfig } from "./bot"
import { logging } from "./logging"

export const config = {
  BOT_TOKEN: process.env['BOT_TOKEN'],
  ...botConfig,
  logging
} as const