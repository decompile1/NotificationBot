import type { Client, Message } from "discord.js";

import { getWelcome } from "@/src/db/models/welcome";

export default async (_client: Client, message: Message) => {
    if (message.author.bot || !message.guild) return;

    const member = message.member;
    if (!member) return;


    if (message.author.bot || !message.guild) return;

    const config = await getWelcome(message.guild.id);
    if (!config?.reactions?.first_message_emojis?.length) return;

    for (const emoji of config.reactions.first_message_emojis) {
        try {
            await message.react(emoji);
        } catch (err) {
            console.warn("Failed to react to first message", err);
        }
    }
};