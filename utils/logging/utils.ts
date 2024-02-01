import type { APIEmbed, WebhookClient } from "discord.js"
import { parseErrorStack } from ".."
import { client } from "../.."

interface ICreateEmbedOptions {
  title: string
  content: any[]
}

export function createEmbedThenSendIt(
  thisWebhook: WebhookClient, 
  options: ICreateEmbedOptions
) {
  console.log('---------------\n', ...options.content, '\n')

  let logContent = ''
  for (const randomThings of options.content) {
    if (randomThings instanceof Error) {
      const error = parseErrorStack(randomThings)
      logContent += error.stack
      continue
    }

    logContent += JSON.stringify(randomThings)
  }

  const embed: APIEmbed = {
    author: {
      icon_url: client.user?.avatarURL()!,
      name: client.user?.tag!
    },
    title: options.title,
    description: `\`\`\`${logContent}\`\`\``,
    timestamp: new Date().toISOString(),
  }

  return thisWebhook.send({
    embeds: [embed]
  })
}

export function createTitle(label: string, name?: string) {
  return `${name ?? ''} - ${label}`.trim()
}