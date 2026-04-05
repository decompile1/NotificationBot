import { ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    type ChatInputCommandInteraction,
    type Client,
    EmbedBuilder } from "discord.js";

export default {
    name: "vote",
    description: "Vote for NotificationBot",
    callback: async (_client: Client, interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor(0x4285f4)
            .setTitle("🗳️ Vote for NotificationBot!")
            .setDescription("Please vote for NotificationBot on top.gg");

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Vote Now")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://top.gg/bot/1366507117044957276#vote")
            );

        await interaction.editReply({
            embeds: [embed],
            components: [row]
        });
    }
};