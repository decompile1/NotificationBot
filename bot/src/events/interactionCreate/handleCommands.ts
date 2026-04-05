import config from "@/src/config";
import getLocalCommands from "@/src/utils/getLocalCommands";

const devs = config.devs;
const testServer = config.testServer;

import type { Client, GuildMember, PermissionResolvable } from "discord.js";

export default async (
    client: Client,
    interaction: {
        isChatInputCommand: () => boolean;
        commandName: string;
        member: { id: string; permissions: { has: (permission: PermissionResolvable) => boolean; }; };
        reply: (arg0: { content: string; ephemeral: boolean; }) => void;
        guild: { id: string; members: { me: GuildMember; }; };
    }
) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = await getLocalCommands();

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if (!commandObject) return;

        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: "Only developers are allowed to run this command. (Command is experimental and could cause mass destruction)",
                    ephemeral: true
                });
                return;
            }
        }

        if (commandObject.testOnly) {
            if (!(interaction.guild.id === testServer)) {
                interaction.reply({
                    content: "This command cannot be ran here. Either this command is currently in maintenance or is broken! Our developers will fix this command soon!",
                    ephemeral: true
                });
                return;
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: "Not enough permissions.",
                        ephemeral: true
                    });
                    return;
                }
            }
        }

        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "I don't have enough permissions.",
                        ephemeral: true
                    });
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "code" in error && (error as { code: number; }).code === 50013) {
            await interaction.reply({
                content:
          "❌ I don't have the required permissions to execute this command. Please ensure my role is **above other roles** and has the necessary permissions.\n\n📹",
                ephemeral: true
            });
        } else {
            console.log(`There was an error running this command: ${error}`);
            await interaction.reply({
                content: "An unexpected error occurred while running this command.",
                ephemeral: true
            });
        }
    }
};