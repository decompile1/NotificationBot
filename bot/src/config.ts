import "@dotenvx/dotenvx/config";

import type { CacheWithLimitsOptions } from "discord.js";

// export config as a constant value
export default {
    client: {
        token: String(process.env["DISCORD_TOKEN"]),
        caches: {
            ApplicationCommandManager: 0,
            BaseGuildEmojiManager: 0,
            GuildEmojiManager: 0,
            GuildMemberManager: { maxSize: 1, keepOverLimit: (member) => member.id === process.env["BOT_ID"] },
            GuildBanManager: 0,
            GuildInviteManager: 0,
            GuildScheduledEventManager: 0,
            GuildStickerManager: 0,
            MessageManager: 0,
            PresenceManager: 0,
            ReactionManager: 0,
            ReactionUserManager: 0,
            StageInstanceManager: 0,
            ThreadManager: 0,
            ThreadMemberManager: 0,
            UserManager: { maxSize: 0, keepOverLimit: (user) => user.id === process.env["BOT_ID"] },
            VoiceStateManager: 0
        } as CacheWithLimitsOptions
    },
    databaseUri: String(process.env["DATABASE_URL"]),
    redisString: String(process.env["REDIS_STRING"]),

    apiSecrets: {
        botApiSecret: String(process.env["API_SECRET"]),

        youtubeAPI: String(process.env["YTV3API"]),

        blueskyIdentifier: String(process.env["BLUESKY_IDENTIFIER"]),
        blueskyPassword: String(process.env["BLUESKY_PASSWORD"]),

        twitchClientId: String(process.env["TWITCH_CLIENT_ID"]),
        twitchClientSecret: String(process.env["TWITCH_CLIENT_SECRET"]),

        redditClientId: String(process.env["REDDIT_CLIENT_ID"]),
        redditClientSecret: String(process.env["REDDIT_CLIENT_SECRET"]),
        redditUsername: String(process.env["REDDIT_USERNAME"]),
        redditPassword: String(process.env["REDDIT_PASSWORD"]),

        githubToken: String(process.env["GITHUB_TOKEN"]),

        kickClientId: String(process.env["KICK_CLIENT_ID"]),
        kickClientSecret: String(process.env["KICK_CLIENT_SECRET"])
    },

    cluster: {
        id: parseInt(process.env["CLUSTER"] ?? "", 10) || 0,
        shards: process.env["SHARDS"]?.split(",").map((shardId) => parseInt(shardId, 10)) ?? [0],
        shardCount: parseInt(process.env["SHARD_COUNT"] ?? "", 10) || 1
    },

    clientId: process.env["clientId"] ?? "",
    owner: process.env["owner"] ?? "",
    devs: (process.env["devs"] ?? "").split(","),
    testServer: process.env["testServer"] ?? null,

    guildId: process.env["GUILD_ID"] ?? "",
    supportServer: process.env["SUPPORT_SERVER"] ?? "",
    supportChannel: process.env["SUPPORT_CHANNEL_ID"] ?? "",
    updatesChannel: process.env["UPDATES_CHANNEL_ID"] ?? "",

    api: {
        api_url: String(process.env["API_URL"]),
        image_api: String(process.env["IMAGE_API"])
    },
    dashboard: String(process.env["DASHBOARD_URL"]),

    colors: {
        primary: parseInt(process.env["COLOR_PRIMARY"] ?? "BD4632", 16),
        success: parseInt(process.env["COLOR_SUCCESS"] ?? "43B581", 16),
        error: parseInt(process.env["COLOR_ERROR"] ?? "F14747", 16),
        warning: parseInt(process.env["COLOR_WARNING"] ?? "FAA619", 16),
        info: parseInt(process.env["COLOR_INFO"] ?? "5865F2", 16)
    },

    integrations: {
        ...process.env["webhook"] && { webhook: process.env["webhook"] }
    },

    ...process.env["ACCESS_ENABLED"] && {
        access: {
            interval: parseInt(process.env["ACCESS_INTERVAL"] ?? "", 10) || 30000,
            webhookLog: process.env["ACCESS_WEBHOOK_LOG"]
        }
    }
} as const;