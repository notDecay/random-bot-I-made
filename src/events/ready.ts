import { ActivityType } from "discord.js"
import { client } from "../"

client.on("ready", async () => {
  client.user?.setPresence({
    activities: [
      {
        name: 'Duck until he embarrassed',
        type: ActivityType.Watching
      }
    ],
    status: 'idle'
  })

  console.log(`${client.user?.tag} is up and ready to go!`)
})