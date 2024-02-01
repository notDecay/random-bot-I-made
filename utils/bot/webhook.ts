import type { 
  MessagePayload, 
  TextChannel, 
  WebhookMessageCreateOptions 
} from "discord.js"

export namespace Webhook {
  export async function findByName(webhookName: string, channel: TextChannel) {
    const webhookList = await channel.fetchWebhooks()
    const thisWebhook = webhookList.find(it => it.name == webhookName)
    if (!thisWebhook) {
      console.log(`cannot find webhook by name: "${webhookName}"`)
    }

    return thisWebhook
  }

  interface IWebhookOptions {
    name: string
    nameIfItDoesNotExist: string
    avatar: string
  }

  interface IWebhookSendOptions {
    channel: TextChannel
    webhook: IWebhookOptions 
  }

  type WebhookMessageData = MessagePayload | WebhookMessageCreateOptions

  export async function send(messageData: WebhookMessageData, options: IWebhookSendOptions) {
    let webhook = await findByName(options.webhook.name, options.channel)
    if (!webhook) {
      webhook = await options.channel.createWebhook({
        name: options.webhook.nameIfItDoesNotExist
      })
    }

    // @ts-ignore
    webhook.send({
      ...messageData,
      avatarURL: options.webhook.avatar,
      username: options.webhook.name,
    })
  }

  export const PIN_MESSAGE_WEBHOOK: IWebhookOptions = {
    avatar: 'https://media.discordapp.net/attachments/1191236400960524429/1191236406383751189/duck_not_good.jpg',
    name: "Pinned Message",
    nameIfItDoesNotExist: "pin message 1d44caf"
  }
}