/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ActionRowBuilder,
    type ChatInputCommandInteraction,
    type Client,
    ComponentType,
    EmbedBuilder,
    StringSelectMenuBuilder
} from "discord.js";

export default {
    name: "help",
    description: "Get started with NotificationBot",
    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        try {
            const commands = await client.application!.commands.fetch();

            const commandEntries = Array.from(commands.values()).map(
                (command) => `**</${command.name}:${command.id}>** - ${command.description}`
            );

            const chunks: string[] = [];
            let currentChunk = "";

            for (const entry of commandEntries) {
                if (currentChunk.length + entry.length + 1 > 1024) {
                    chunks.push(currentChunk);
                    currentChunk = entry;
                } else {
                    currentChunk += (currentChunk ? "\n" : "") + entry;
                }
            }
            if (currentChunk) {
                chunks.push(currentChunk);
            }

            const mainEmbed = new EmbedBuilder()
                .setColor(0x333333)
                .setTitle("Welcome to NotificationBot Help")
                .setDescription(
                    "Use the select menu below to get more information about the bot. \n\n- Main Page: Returns to this page. \n- Commands: View a list of all available commands. \n- Add Bot: Get a link to add NotificationBot to your server."
                )
                .addFields({ name: "Support Server", value: "[Click me](https://discord.gg/GNdJMJCBdu)", inline: true })
                .addFields({ name: "Add NotificationBot", value: "Click the link to add NotificationBot to your server: [Add NotificationBot](https://discord.com/oauth2/authorize?client_id=1237878380838523001)", inline: true })
                .setTimestamp()
                .setFooter({ text: "NotificationBot" });

            const commandsEmbed = new EmbedBuilder()
                .setColor(0x333333)
                .setTitle("Commands")
                .setDescription("Here's a list of all available commands:")
                .setFooter({ text: "NotificationBot" });

            chunks.forEach((chunk, index) => {
                commandsEmbed.addFields({
                    name: index === 0 ? "Commands" : "More",
                    value: chunk,
                    inline: false
                });
            });

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId("help-menu")
                .setPlaceholder("Select an option")
                .addOptions([
                    {
                        label: "Main Page",
                        description: "Return to the main help page",
                        value: "main_page"
                    },
                    {
                        label: "Commands",
                        description: "View all available commands",
                        value: "commands"
                    }
                ]);

            const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                selectMenu
            );

            const sentMessage = await interaction.editReply({
                embeds: [mainEmbed],
                components: [row]
            });

            const collector = sentMessage.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                filter: (i) => i.user.id === interaction.user.id
            });

            collector.on("collect", async (menuInteraction) => {
                const selectedValue = menuInteraction.values[0];
                switch (selectedValue) {
                    case "main_page":
                        await menuInteraction.update({
                            embeds: [mainEmbed],
                            components: [row]
                        });
                        break;
                    case "commands":
                        await menuInteraction.update({
                            embeds: [commandsEmbed],
                            components: [row]
                        });
                        break;
                }
            });

            collector.on("end", async () => {
                try {
                    await sentMessage.edit({ components: [] });
                } catch (error: any) {
                    console.warn(
                        `[help.ts] Could not clear components after collector end: ${error.name || "Error"} - ${error.message || "Unknown error"}`
                    );
                }
            });

        } catch (error) {
            console.error("Error fetching commands:", error);
            await interaction.editReply(
                "Sorry, I couldn't fetch the commands. Please try again later."
            );
        }
    }
};