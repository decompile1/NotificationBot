import type { Client } from "discord.js";

export default async (client: Client, guildId: string | null) => {
    let applicationCommands;

    if (guildId) {
        const guild = await client.guilds.fetch(guildId);
        applicationCommands = guild.commands;
    } else {
        if (client.application) {
            applicationCommands = client.application.commands;
        } else {
            throw new Error("Client application is not available.");
        }
    }

    await applicationCommands.fetch({});
    return applicationCommands;
};