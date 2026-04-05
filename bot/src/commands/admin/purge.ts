import {
    ApplicationCommandOptionType,
    type ChatInputCommandInteraction,
    type Client,
    TextChannel
} from "discord.js";

export default {
    name: "purge",
    description: "Deletes a custom number of messages between 10 and 100.",
    options: [
        {
            name: "amount",
            type: ApplicationCommandOptionType.Integer,
            description: "Number of messages to delete (between 10 and 100).",
            required: true,
            min_value: 10,
            max_value: 100
        }
    ],

    callback: async (_client: Client, interaction: ChatInputCommandInteraction) => {
        if (!(interaction.channel instanceof TextChannel)) {
            await interaction.reply("This command can only be used in text channels.");
            return;
        }

        const amount = interaction.options.getInteger("amount");

        if (amount! < 10 || amount! > 100) {
            await interaction.reply("Please provide a number between 10 and 100.");
            return;
        }

        try {
            const messages = await interaction.channel?.messages.fetch({ limit: amount! });
            const filteredMessages = messages?.filter((msg) => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000);

            if (filteredMessages && filteredMessages.size > 0) {
                await interaction.channel.bulkDelete(filteredMessages, true);
                await interaction.reply(`Successfully deleted ${filteredMessages.size} messages.`);
            } else {
                await interaction.reply("No messages were deleted because they are older than 14 days.");
            }
        } catch (error) {
            console.error(error);
            await interaction.followUp("There was an error while trying to purge messages.");
        }
    }
};