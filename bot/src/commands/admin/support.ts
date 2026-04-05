import { ActionRowBuilder,
    ChannelType,
    type Client,
    type CommandInteraction,
    EmbedBuilder,
    type GuildTextBasedChannel,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle } from "discord.js";

import config from "@/src/config";

export default {
    name: "support",
    description: "Support and questions for the bot",

    callback: async (client: Client, interaction: CommandInteraction) => {
        try {
            const modal = new ModalBuilder().setCustomId(`supportModal-${interaction.user.id}`).setTitle("Support Form");

            const topicInput = new TextInputBuilder()
                .setCustomId("topicInput")
                .setLabel("Topic")
                .setStyle(TextInputStyle.Short);

            const suggestionInput = new TextInputBuilder()
                .setCustomId("suggestionInput")
                .setLabel("Response")
                .setStyle(TextInputStyle.Paragraph);

            const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(topicInput);
            const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(suggestionInput);

            modal.addComponents(firstActionRow, secondActionRow);

            await interaction.showModal(modal);

            const filter = (i: { customId: string; }) => i.customId === `supportModal-${interaction.user.id}`;

            const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 30000 });

            if (!modalInteraction) {
                await interaction.followUp({
                    content: "You did not respond in time. The modal has closed.",
                    ephemeral: true
                });
                return;
            }

            const suggestionValue = modalInteraction.fields.getTextInputValue("suggestionInput");
            const topicValue = modalInteraction.fields.getTextInputValue("topicInput");

            if (!suggestionValue || !topicValue) {
                await interaction.followUp({
                    content: "Some inputs are missing. The modal has closed.",
                    ephemeral: true
                });
                return;
            }

            const guild = client.guilds.cache.get(config.guildId);
            if (!guild) {
                console.error("Invalid guild ID");
                return;
            }

            const channel = guild.channels.cache.get(config.supportChannel);

            if (!channel || channel.type !== ChannelType.GuildText) {
                console.error("Invalid or unsupported channel type.");
                return;
            }

            const replyEmbed = new EmbedBuilder()
                .setTitle(`Suggestion by ${interaction.user.username}`)
                .addFields({ name: "Topic", value: topicValue }, { name: "Suggestion", value: suggestionValue })
                .setFooter({ text: "NotificationBot" })
                .setTimestamp();

            await (channel as GuildTextBasedChannel).send({ embeds: [replyEmbed] });

            await interaction.followUp({
                content: "Suggestion sent!",
                ephemeral: true
            });

            await modalInteraction.deferUpdate();
        } catch (error) {
            console.error("Error handling the modal:", error);
            await interaction.followUp({
                content: "An error occurred while processing your request. Please try again later.",
                ephemeral: true
            });
        }
    }
};