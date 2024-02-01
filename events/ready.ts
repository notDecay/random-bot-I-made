import { client, logdown } from "../"
import { config } from "../config"

client.on('ready', () => {
  client.user?.setStatus(config.status)
  client.user?.setActivity(config.activity[0])
  console.log(`${client.user?.tag} is up and ready to go!`)
  logdown.log(`${client.user?.tag} is up and ready to go!`)
})