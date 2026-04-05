import { type Client, EmbedBuilder } from "discord.js";
import Parser from "rss-parser";

import { getDmNotifications } from "@/src/db/models/dmnotifications";

const parser = new Parser();

export function fetchDmNotifications(client: Client, userId?: string) {
    const run = async () => {
        try {
            const allUsers = await getDmNotifications(userId);

            for (const user of allUsers) {
                const { user_id, source, text, embedcolor, thumbnail } = user;

                if (!source) continue;

                try {
                    const content = await fetchFromSource(source);
                    if (!content) continue;

                    const embed = new EmbedBuilder()
                        .setTitle("🔔 Daily Notification")
                        .setDescription(`${text ?? ""} ${source}`)
                        .addFields({ name: "Content", value: content })
                        .setColor(embedcolor ?? 0x5865f2);

                    if (thumbnail) embed.setThumbnail(thumbnail);

                    const userObj = await client.users.fetch(user_id);
                    await userObj.send({ embeds: [embed] });

                } catch (err) {
                    console.error(`Failed to notify user ${user.user_id}:`, err);
                }
            }
        } catch (err) {
            console.error("Failed to run DM notifications routine:", err);
        }
    };

    // Run immediately
    run();

    // Run every 1 minute
    setInterval(run, 60 * 1000);
}

// Helper function to fetch RSS content
async function fetchFromSource(source: string): Promise<string | null> {
    try {
        const feed = await parser.parseURL(source);
        const latestItem = feed.items[0];

        if (!latestItem) return null;

        const title = latestItem.title ?? "No title";
        const link = latestItem.link ?? "";

        return `**${title}**\n${link}`;
    } catch (err) {
        console.error(`Error fetching RSS feed from ${source}:`, err);
        return null;
    }
}