import type { ChatInputCommandInteraction, Client } from "discord.js";

export default {
    name: "ping",
    description: "Replies with pong",

    callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`);
    }
};