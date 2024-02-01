import { WebhookClient } from "discord.js"
import { createEmbedThenSendIt, createTitle } from "./utils"

interface ILoggerCreateOptions {
  webhook: {
    id: string
    token: string
  }
  name?: string
}

export namespace Logger {
  export function create(options: ILoggerCreateOptions) {
    const { webhook, name } = options
    const thisWebhook = new WebhookClient({ 
      url: `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}` 
    })

    return {
      log(...something: any[]) {
        createEmbedThenSendIt(thisWebhook, {
          content: something,
          title: createTitle('Log', name)
        })
      }
    }
  }
}