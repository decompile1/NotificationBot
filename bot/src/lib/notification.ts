import type { Client, Guild, Message } from "discord.js";

import { notificationPlaceholders } from "@/src/constants/discord";
import { getAllNotifications, getNotificationById } from "@/src/db/models/notifications";
import { fetchers } from "@/src/lib/getUploads";
import redis from "@/src/lib/redis";
import { replacePlaceholder } from "@/src/utils/replacePlaceholder";
import type { ContentData, notificationConfig, NotificationType } from "@/typings";

export default async function sendNotification(
    _client: Client,
    _message: Message,
    id: string,
    guild: Guild,
    config: notificationConfig,
    type: NotificationType,
    contentData: ContentData
) {
    const dbConfig = await getNotificationById(id);
    if (!dbConfig || !dbConfig.id || !dbConfig.guild_id || !dbConfig.channel_id) return;
    if (dbConfig.type !== type) return;

    const fetcher = fetchers[type];
    if (!fetcher) return;

    // fetch latest data
    const latestContent = await fetcher(config);
    if (!latestContent || !latestContent.link) return;

    // Redis key for last sent content
    const redisKey = `notification:last:${dbConfig.id}`;
    const lastSentLink = await redis.get(redisKey);
    if (lastSentLink === latestContent.link) return;

    const channel = guild.channels.cache.get(dbConfig.channel_id);
    if (!channel || !channel.isTextBased()) return;

    const placeholders = {
        ...notificationPlaceholders(guild, config, type, contentData)
    };

    let content = replacePlaceholder(dbConfig.message?.content || "", placeholders);
    content += `\n${latestContent.link}`;

    if (dbConfig.role_id) {
        let roleMention: string;

        if (dbConfig.role_id.toLowerCase() === "everyone") {
            roleMention = "@everyone";
            // Remove any duplicates in the message content
            content = content.replace(/@+everyone/g, "@everyone").trim();
        } else {
            // Only valid numbers for role IDs
            const roleId = dbConfig.role_id.replace(/[^0-9]/g, "");
            roleMention = `<@&${roleId}>`;
            // Remove duplicates if somehow present
            const regex = new RegExp(`<@&${roleId}>`, "g");
            content = content.replace(regex, "").trim();
        }

        // Prepend sanitized role mention
        content = `${roleMention} ${content}`;
    }

    if (dbConfig.message?.embed) {
        const { title, description, color, image, thumbnail, footer } = dbConfig.message.embed;

        const embed = {
            title: title ? replacePlaceholder(title, placeholders) : undefined,
            description: description ? replacePlaceholder(description, placeholders) : undefined,
            color: color || 0x333333,
            image: image ? { url: replacePlaceholder(image, placeholders) } : undefined,
            thumbnail: thumbnail ? { url: replacePlaceholder(thumbnail, placeholders) } : undefined,
            footer: footer?.text
                ? {
                    text: replacePlaceholder(footer.text, placeholders),
                    icon_url: footer.icon_url
                        ? replacePlaceholder(footer.icon_url, placeholders)
                        : undefined
                }
                : undefined
        };

        const cleanedEmbed = Object.fromEntries(
            Object.entries(embed).filter(([_, v]) => v !== undefined)
        );

        const hasValidFields =
            cleanedEmbed.title ||
            cleanedEmbed.description ||
            cleanedEmbed.image ||
            cleanedEmbed.thumbnail ||
            cleanedEmbed.footer;

        if (hasValidFields) {
            await channel.send({ content, embeds: [cleanedEmbed] });
            await redis.set(redisKey, latestContent.link);
        } else {
            await channel.send({ content });
            await redis.set(redisKey, latestContent.link);
        }
    } else {
        await channel.send({ content });
        await redis.set(redisKey, latestContent.link);
    }
}

export function fetchNotifications(client: Client) {
    const run = async () => {
        if (!client?.guilds?.cache) return;

        try {
            const configs = await getAllNotifications();
            for (const config of configs) {
                if (!config.channel_id || !config.id || config.type === null) continue;
                const guild = client.guilds.cache.get(config.guild_id);
                if (!guild) continue;

                try {
                    await sendNotification(
                        client,
                        {} as Message,
                        config.id,
                        guild,
                        config as notificationConfig,
                        config.type,
                        {} as ContentData
                    );
                } catch (err) {
                    console.error(`Error sending notification for ${config.id}:`, err);
                }
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    // Run immediately
    run();

    // Run every 1 minute
    setInterval(run, 60 * 1000);
}