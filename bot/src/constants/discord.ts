/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Client, Guild, GuildMember, User } from "discord.js";

import type { ContentData, notificationConfig, NotificationType } from "@/typings";

export function getTotalStats(client: Client) {
    const totalGuilds = client.guilds.cache.size;
    const totalUsers = client.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);

    return { totalGuilds, totalUsers };
}

export const welcomerPlaceholders = (member: GuildMember, inviter: User | null, inviteCode?: string, inviteCount?: number) => {
    const user = member.user;
    const guild = member.guild;

    const placeholders: Record<string, string | number> = {
        // user
        "user.mention": `<@${user.id}>`,
        "user.id": user.id,
        "user.tag": user.tag,
        "user.name": user.username,
        "user.avatar": user.displayAvatarURL(),

        // guild
        "guild.name": guild.name,
        "guild.id": guild.id,
        "guild.avatar": guild.iconURL() || "",
        "guild.rules": guild.rulesChannel ? `<#${guild.rulesChannel.id}>` : "",
        "guild.memberCount": guild.memberCount
    };

    if (inviter) {
        Object.assign(placeholders, {
            "inviter.mention": `<@${inviter.id}>`,
            "inviter.id": inviter.id,
            "inviter.tag": inviter.tag,
            "inviter.name": inviter.username,
            "inviter.avatar": inviter.displayAvatarURL(),
            "inviter.code": inviteCode || "",
            "inviter.count": inviteCount || 0
        });
    }

    return placeholders;
};

export const notificationPlaceholders = (
    guild: Guild,
    config: notificationConfig | undefined,
    type: NotificationType,
    contentData: ContentData | undefined
) => {
    // Properly typed defaults
    const creator = config?.creator ?? {
        id: null,
        username: null,
        custom_url: null,
        avatar_url: null
    };
    const contentCreator = contentData?.creator ?? {
        id: null,
        username: null,
        custom_url: null,
        avatar_url: null,
        posts: 0,
        followers: 0
    };

    const placeholders: Record<string, any> = {
        "creator.name": creator.username ?? "Unknown",
        "creator.id": creator.id ?? "Unknown",
        "creator.link": creator.custom_url ?? "",
        "creator.avatar": creator.avatar_url ?? "",

        // Guild meta
        "guild.name": guild?.name ?? "Unknown",
        "guild.id": guild?.id ?? "Unknown",
        "guild.avatar": guild?.iconURL() ?? "",
        "guild.rules": guild?.rulesChannel ? `<#${guild.rulesChannel.id}>` : "",
        "guild.memberCount": guild?.memberCount?.toLocaleString() ?? "0",

        ping: config?.role_id ? `<@&${config.role_id}>` : ""
    };

    if (!contentData) return placeholders;

    switch (type) {
        case 0: // YouTube
            Object.assign(placeholders, {
                "video.title": contentData.videoTitle ?? "",
                "video.id": contentData.videoId ?? "",
                "video.link": contentData.videoId ? `https://youtube.com/watch?v=${contentData.videoId}` : "",
                "video.thumbnail": contentData.videoId ? `https://i4.ytimg.com/vi/${contentData.videoId}/hqdefault.jpg` : "",
                "video.uploaded.ago": contentData.timestamp ? `<t:${contentData.timestamp}:R>` : "",
                "video.uploaded.at": contentData.timestamp ? `<t:${contentData.timestamp}:f>` : "",
                "creator.subs": contentData.subscriberCount ?? 0,
                "creator.videos": contentData.videoCount ?? 0,
                "creator.views": contentData.viewCount ?? 0
            });
            break;

        case 1: // Reddit
            Object.assign(placeholders, {
                "post.id": contentData.id ?? "",
                "post.title": contentData.title ?? "",
                "post.text": contentData.text ?? "",
                "post.thumbnail": contentData.thumbnail ?? "",
                "post.flair": contentData.flair ?? "",
                "post.posted.ago": contentData.timestamp ? `<t:${contentData.timestamp}:R>` : "",
                "post.posted.at": contentData.timestamp ? `<t:${contentData.timestamp}:f>` : "",
                "author.username": contentData.author?.username ?? "Unknown",
                "author.id": contentData.author?.id ?? "Unknown",
                "author.link": contentData.author?.username ? `https://reddit.com/user/${contentData.author.username}` : "",
                "subreddit.name": contentData.subreddit?.name ?? "Unknown",
                "subreddit.id": contentData.subreddit?.id ?? "Unknown",
                "subreddit.members": contentData.subreddit?.members ?? 0
            });
            break;

        case 2: // Twitch
            Object.assign(placeholders, {
                "stream.title": contentData.title ?? "",
                "stream.id": contentData.id ?? "",
                "stream.link": creator.username ? `https://twitch.tv/${creator.username}` : "",
                "stream.game": contentData.game ?? "",
                "stream.thumbnail": contentData.thumbnail ?? "",
                "stream.live.since": contentData.startedAt ? `<t:${contentData.startedAt}:R>` : "",
                "stream.live.start": contentData.startedAt ? `<t:${contentData.startedAt}:f>` : ""
            });
            break;

        case 3: // Bluesky
            Object.assign(placeholders, {
                "post.id": contentData.id ?? "",
                "post.type": contentData.type ?? "",
                "post.text": contentData.text ?? "",
                "post.link": contentData.link ?? "",
                "post.posted.ago": contentData.timestamp ? `<t:${contentData.timestamp}:R>` : "",
                "post.posted.at": contentData.timestamp ? `<t:${contentData.timestamp}:f>` : "",
                "creator.handle": creator.username ?? "Unknown",
                "creator.posts": contentCreator.posts ?? 0,
                "creator.followers": contentCreator.followers ?? 0
            });
            break;

        case 4: // GitHub
            Object.assign(placeholders, {
                "repo.name": contentData.repoName ?? "",
                "repo.id": contentData.id ?? "",
                "repo.link": contentData.link ?? "",
                "repo.description": contentData.description ?? "",
                "repo.language": contentData.language ?? "",
                "repo.stars": contentData.stars ?? 0,
                "repo.forks": contentData.forks ?? 0,
                "repo.updated": contentData.timestamp
                    ? `<t:${contentData.timestamp}:R>`
                    : "",
                "release.title": contentData.releaseTitle ?? "",
                "release.link": contentData.releaseLink ?? "",
                "creator.username": contentCreator.username ?? "Unknown",
                "creator.link": contentCreator.username
                    ? `https://github.com/${contentCreator.username}`
                    : "",
                "creator.avatar": contentCreator.avatar_url ?? ""
            });
            break;

        case 5: // Kick
            Object.assign(placeholders, {
                "stream.title": contentData.title ?? "",
                "stream.category": contentData.category ?? "",
                "stream.thumbnail": contentData.thumbnail ?? "",
                "stream.viewers": contentData.viewerCount ?? 0,
                "stream.link": contentData.link ?? "",
                "stream.live.since": contentData.startedAt
                    ? `<t:${contentData.startedAt}:R>`
                    : "",
                "stream.live.start": contentData.startedAt
                    ? `<t:${contentData.startedAt}:f>`
                    : "",
                "creator.username": contentCreator.username ?? "Unknown",
                "creator.followers": contentCreator.followers ?? 0,
                "creator.link": contentCreator.username
                    ? `https://kick.com/${contentCreator.username}`
                    : "",
                "creator.avatar": contentCreator.avatar_url ?? ""
            });
            break;
    }

    return placeholders;
};