import type { Client, GuildMember, Message, User } from "discord.js";

import appConfig from "@/src/config";
import { welcomerPlaceholders } from "@/src/constants/discord";
import { getBye } from "@/src/db/models/bye";
import { getWelcome, updateWelcome } from "@/src/db/models/welcome";
import { replacePlaceholder } from "@/src/utils/replacePlaceholder";

export default async (
    _client: Client,
    member: GuildMember,
    inviter: User | null,
    inviteCode?: string,
    inviteCount?: number
) => {
    const { guild } = member;

    let sentMessage: Message | undefined;

    const placeholders = {
        ...welcomerPlaceholders(member, inviter, inviteCode, inviteCount)
    };

    const config = await getBye(guild.id);

    if (!config || !config.enabled || !config.channel_id) return;

    const channel = guild.channels.cache.get(config.channel_id);
    if (!channel || !channel.isTextBased()) return;

    try {
        const welcomeConfig = await getWelcome(guild.id);
        const messageId = welcomeConfig?.welcome_message_ids?.[member.id];
        if (messageId && welcomeConfig?.welcome_message_ids && welcomeConfig.channel_id) {
            const welcomeChannel = guild.channels.cache.get(welcomeConfig.channel_id);
            if (welcomeChannel?.isTextBased()) {
                const msg = await welcomeChannel.messages.fetch(messageId).catch(() => null);
                if (msg) await msg.delete().catch(() => null);

                // Remove from DB
                delete welcomeConfig.welcome_message_ids[member.id];
                await updateWelcome(guild.id, {
                    welcome_message_ids: welcomeConfig.welcome_message_ids
                });
            }
        }
    } catch (err) {
        console.warn("[Bye] Failed to delete welcome message, continuing:", err);
    }

    const content = replacePlaceholder(config.message?.content || "", placeholders);
    const embedConfig = config.message?.embed;

    // Only send the embed if it has at least a title, description, image, or thumbnail
    const hasEmbed =
        embedConfig &&
    (embedConfig.title || embedConfig.description || embedConfig.image || embedConfig.thumbnail);

    if (hasEmbed) {
        const { title, description, color, image, thumbnail, footer } = embedConfig;
        const embed = {
            title: title ? replacePlaceholder(title, placeholders) : undefined,
            description: description ? replacePlaceholder(description, placeholders) : undefined,
            color: color || 0x333333,
            image: image ? { url: replacePlaceholder(image, placeholders) } : undefined,
            thumbnail: thumbnail ? { url: replacePlaceholder(thumbnail, placeholders) } : undefined,
            footer: footer?.text
                ? {
                    text: replacePlaceholder(footer.text, placeholders),
                    icon_url: footer.icon_url ? replacePlaceholder(footer.icon_url, placeholders) : undefined
                }
                : undefined
        };

        sentMessage = await channel.send({
            content: content || undefined, // send content too if available
            embeds: [embed]
        });
    } else if (content) {
    // Only send the plain content if embed is not valid
        sentMessage = await channel.send({ content });
    }

    if (config.delete_after && Number.isFinite(config.delete_after) && config.delete_after > 0) {
        setTimeout(() => sentMessage?.delete().catch(() => {}), config.delete_after * 1000);
    }

    // card
    if (config.card?.enabled) {
        try {
            const { in_embed, background, text_color } = config.card;

            const params = new URLSearchParams({
                type: "goodbye",
                username: member.user.username,
                members: member.guild.memberCount.toString(),
                hash: member.user.id,
                background: background || "#222",
                text_color: text_color ? `#${text_color.toString(16).padStart(6, "0")}` : "#fff"
            });

            const cardImageUrl = `${appConfig.api.image_api}/welcome-card?${params.toString()}`;

            if (in_embed) {
                await channel.send({
                    embeds: [
                        {
                            image: { url: cardImageUrl }
                        }
                    ]
                });
            } else {
                await channel.send({ content: cardImageUrl });
            }

        } catch (err) {
            console.warn("Failed to send welcome card:", err);
        }
    }
};