import { client, slashCommands } from "../"
import Duck from "../handler"

client.on("interactionCreate", async (interaction) => {
  Duck.handleRunningSlashCommand(interaction)

  // Context Menu Handling
  if (interaction.isContextMenuCommand()) {
    await interaction.deferReply({ 
      ephemeral: false 
    })
    const command = slashCommands.get(interaction.commandName)
    if (command) command.run({
      client, interaction, args: []
    })
  }
})