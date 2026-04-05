import type { Client, Message } from "discord.js";

import { getTotalStats } from "@/src/constants/discord";
import { fetchDmNotifications } from "@/src/lib/dmNotifications";
import { fetchNotifications } from "@/src/lib/notification";
import redis from "@/src/lib/redis";
import saveShards from "@/src/lib/saveShards";

export default async (client: Client) => {

    if (client.user) {
        console.log(`${client.user.tag} is online`);
        await saveShards(client);
        await fetchNotifications(client);
        await fetchDmNotifications(client);

        setInterval(async () => {
            try {
                await redis.flushall();
                console.log("[Redis] Cache cleared");
            } catch (err) {
                console.error("Error clearing Redis cache:", err);
            }
        }, 7 * 24 * 60 * 60 * 1000);

        let currentIndex = 0;

        const updateActivity = () => {
            if (!client.user) return;

            const { totalGuilds, totalUsers } = getTotalStats(client);

            const activities = [
                { name: `/help | ${totalGuilds} guild${totalGuilds !== 1 ? "s" : ""}`, type: 4 },
                {
                    name: `Notifying ${totalUsers.toLocaleString()} users across ${totalGuilds} server${totalGuilds !== 1 ? "s" : ""}`,
                    type: 4
                },
                { name: "https://notificationbot.top | /help", type: 4 },
                { name: `Keeping ${totalUsers.toLocaleString()} users notified`, type: 4 },
                { name: `Online since ${new Date(client.readyAt!).toLocaleDateString()}`, type: 3 }
            ];

            const activity = activities[currentIndex];

            console.log(`Status: ${activity.name}`);

            client.user.setPresence({
                status: "dnd",
                activities: [activity]
            });

            currentIndex = (currentIndex + 1) % activities.length;
        };

        updateActivity();
        setInterval(updateActivity, 86400000); // ms

        client.on("messageCreate", (message: Message) => {
            if (message.author.bot) return;

            if (message.mentions.has(client!.user!)) {
                message.reply(`Hello ${message.author.username}, use /help if you need any help`);
            }
        });
    }
};