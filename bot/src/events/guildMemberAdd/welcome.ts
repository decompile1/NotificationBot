/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Client, GuildMember, User } from "discord.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import appConfig from "@/src/config";
import { welcomerPlaceholders } from "@/src/constants/discord";
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

    const placeholders = {
        ...welcomerPlaceholders(member, inviter, inviteCode, inviteCount)
    };

    const config = await getWelcome(guild.id);

    if (!config || !config.enabled || !config.channel_id) return;

    const channel = guild.channels.cache.get(config.channel_id);
    if (!channel || !channel.isTextBased()) return;

    // Button setup
    const components: ActionRowBuilder<ButtonBuilder>[] = [];
    if (config.button?.enabled) {
        const button = new ButtonBuilder()
            .setStyle(config.button.style || ButtonStyle.Primary)
            .setCustomId(`welcome-button-${member.id}`)
            .setDisabled(false)
            .setLabel(config.button.label || "Say hi");

        if (config.button.emoji) button.setEmoji(config.button.emoji);

        components.push(new ActionRowBuilder<ButtonBuilder>().addComponents(button));
    }

    // CHANNEL MESSAGE
    const channelContent = replacePlaceholder(config.message?.content || "", placeholders);
    const channelEmbedConfig = config.message?.embed;

    let channelEmbed: any | undefined;
    if (channelEmbedConfig) {
        channelEmbed = {};
        if (channelEmbedConfig.title)
            channelEmbed.title = replacePlaceholder(channelEmbedConfig.title, placeholders);
        if (channelEmbedConfig.description)
            channelEmbed.description = replacePlaceholder(channelEmbedConfig.description, placeholders);

        if (!channelEmbed.title && !channelEmbed.description) {
            channelEmbed = undefined; // skip empty embed
        }

        if (channelEmbed) {
            channelEmbed.color = channelEmbedConfig.color || 0x333333;
            if (channelEmbedConfig.image)
                channelEmbed.image = { url: replacePlaceholder(channelEmbedConfig.image, placeholders) };
            if (channelEmbedConfig.thumbnail)
                channelEmbed.thumbnail = { url: replacePlaceholder(channelEmbedConfig.thumbnail, placeholders) };
            if (channelEmbedConfig.footer?.text)
                channelEmbed.footer = {
                    text: replacePlaceholder(channelEmbedConfig.footer.text, placeholders),
                    icon_url: channelEmbedConfig.footer.icon_url
                        ? replacePlaceholder(channelEmbedConfig.footer.icon_url, placeholders)
                        : undefined
                };
        }
    }

    // === SEND TO CHANNEL ===
    const sentMessage = await channel.send({
        content: channelContent || undefined,
        embeds: channelEmbed ? [channelEmbed] : undefined,
        components: components.length ? components : undefined
    });

    if (config.delete_after_leave && sentMessage) {
        const welcomeMessageIds = { ...(config.welcome_message_ids || {}) };
        welcomeMessageIds[member.id] = sentMessage.id;
        await updateWelcome(guild.id, { welcome_message_ids: welcomeMessageIds });
    }

    // Auto-delete
    // in miliseconds
    if (config.delete_after && Number.isFinite(config.delete_after) && config.delete_after > 0) {
        setTimeout(() => sentMessage?.delete().catch(() => {}), config.delete_after * 1000);
    }

    // DM
    if (config.dm?.enabled) {
        try {
            const dmChannel = await member.createDM().catch(() => null);
            if (!dmChannel) {
                return;
            }

            const dmContent = replacePlaceholder(config.dm.message?.content || "", placeholders);
            const dmEmbedConfig = config.dm.message?.embed;

            let dmEmbed: any | undefined;
            if (dmEmbedConfig) {
                dmEmbed = {};
                if (dmEmbedConfig.title) dmEmbed.title = replacePlaceholder(dmEmbedConfig.title, placeholders);
                if (dmEmbedConfig.description) dmEmbed.description = replacePlaceholder(dmEmbedConfig.description, placeholders);
                if (!dmEmbed.title && !dmEmbed.description) dmEmbed = undefined; // skip empty embed
                if (dmEmbed) {
                    dmEmbed.color = dmEmbedConfig.color || 0x333333;
                    if (dmEmbedConfig.image) dmEmbed.image = { url: replacePlaceholder(dmEmbedConfig.image, placeholders) };
                    if (dmEmbedConfig.thumbnail) dmEmbed.thumbnail = { url: replacePlaceholder(dmEmbedConfig.thumbnail, placeholders) };
                    if (dmEmbedConfig.footer?.text)
                        dmEmbed.footer = {
                            text: replacePlaceholder(dmEmbedConfig.footer.text, placeholders),
                            icon_url: dmEmbedConfig.footer.icon_url
                                ? replacePlaceholder(dmEmbedConfig.footer.icon_url, placeholders)
                                : undefined
                        };
                }
            }

            if (dmContent || dmEmbed) {
                await member.send({
                    content: dmContent || undefined,
                    embeds: dmEmbed ? [dmEmbed] : undefined
                });
            }
        } catch (err) {
            console.warn("[Welcome DM] Failed to send DM:", err);
        }
    }

    // card
    if (config.card?.enabled) {
        try {
            const { in_embed, background, text_color } = config.card;

            const params = new URLSearchParams({
                type: "welcome",
                username: member.user.username,
                members: member.guild.memberCount.toString(),
                hash: member.user.avatar ?? "",
                id: member.user.id,
                background: background || "#222",
                text_color: text_color ? `#${text_color.toString(16).padStart(6, "0")}` : "#fff"
            });

            const cardImageUrl = `${appConfig.api.image_api}/welcome-card?${params.toString()}`;
            console.log(`${appConfig.api.image_api}/welcome-card?${params.toString()}`);

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

    // Reactions
    if (config.reactions?.welcome_message_emojis?.length && sentMessage?.id) {
        for (const emoji of config.reactions.welcome_message_emojis) {
            try {
                await sentMessage.react(emoji);
            } catch (err) {
                console.warn(`[Welcome Reaction] Failed to react with ${emoji}:`, err);
            }
        }
    }

    // Roles
    if (config.role_ids?.length) {
        const botMember = guild.members.me;
        if (!botMember) return; // if bot member is not cached, skip

        for (const roleId of config.role_ids) {
        // Skip @everyone role
            if (roleId === guild.id) continue;

            const role = guild.roles.cache.get(roleId);
            if (!role) continue; // role doesn't exist, skip

            // Skip if bot's highest role is not above the target role
            if (botMember.roles.highest.position <= role.position) continue;

            // Try to add role while ignoring missing permissions
            try {
                await member.roles.add(role);
            } catch (err: any) {
                if (err.code !== 50013 && err.code !== 10011) { // 50013 = Missing Permissions, 10011 = Unknown Role
                    console.error(`[Welcome Role] Failed to add role ${role.name}:`, err);
                }
            // silently skip missing permissions or unknown roles
            }
        }
    }

    // Ghost pings
    if (config.ping_ids?.length) {
        for (const channelId of config.ping_ids) {
            const pingChannel = guild.channels.cache.get(channelId);
            if (!pingChannel || !pingChannel.isTextBased()) continue;

            try {
                const ghostMessage = await pingChannel.send(`<@${member.id}>`);
                setTimeout(() => ghostMessage.delete().catch(() => {}), 3000);
            } catch (err) {
                console.error(`[Welcome Ghost Ping] Failed in ${channelId}:`, err);
            }
        }
    }
};