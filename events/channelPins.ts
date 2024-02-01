import { client } from ".."

client.on('channelPinsUpdate', (channel) => {
  console.log(channel)
})