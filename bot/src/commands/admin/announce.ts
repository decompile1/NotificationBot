import { ChannelType,
    type ChatInputCommandInteraction,
    type Client,
    type CommandInteraction,
    type GuildTextBasedChannel,
    PermissionFlagsBits } from "discord.js";

export default {
    name: "announce",
    description: "Send an announcement to a specific channel",
    options: [
        {
            type: 7,
            name: "channel",
            description: "The channel to send the announcement to",
            required: true
        },
        {
            type: 3,
            name: "message",
            description: "The announcement message",
            required: true
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageRoles],

    callback: async (_client: Client, interaction: CommandInteraction) => {

        await interaction.deferReply();

        const ChatInputCommandInteraction = interaction as ChatInputCommandInteraction;

        const channel = ChatInputCommandInteraction.options.getChannel("channel");
        const message = ChatInputCommandInteraction.options.getString("message");

        if (!channel || channel.type !== ChannelType.GuildText) {
            return interaction.editReply("You must specify a valid text channel.");
        }

        if (!message) {
            return interaction.editReply("You must provide a message for the announcement.");
        }

        try {
            await (channel as GuildTextBasedChannel).send(message);
            interaction.editReply(`Announcement successfully sent to ${channel}!`);
        } catch (error) {
            console.error("Error sending announcement:", error);
            interaction.editReply("There was an error sending the announcement.");
        }
    }
};