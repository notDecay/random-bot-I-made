import { ApplicationCommandOptionType } from "discord.js"
import { client, slashCommands } from "../"

client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    console.log('running', interaction.commandName)
    
    const cmd = slashCommands.get(interaction.commandName)
    if (!cmd) {
      return void interaction.followUp({ 
        content: "An error has occured" 
      })
    }

    console.log('extracting the args')

    const args: string[] = []

    for (const option of interaction.options.data) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        if (option.name) {
          args.push(option.name)
        }

        if (!option.options) continue

        for (const x of option.options) {
          if (x.value) args.push(x.value as string)
        }
      }
      if (option.value) {
        args.push(option.value as string)
      }
    }

    console.log('running it')

    // @ts-ignore
    interaction.member = interaction.guild.members.cache.get(interaction.user.id)

    cmd.run({ client, interaction, args })
  }

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