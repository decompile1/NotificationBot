import "@dotenvx/dotenvx/config";

export default {
    client: {
        token: String(process.env["DISCORD_TOKEN"]),
        clientId: String(process.env["DISCORD_CLIENT_ID"]),
        clientSecret: String(process.env["DISCORD_CLIENT_SECRET"])
    },

    apiSecrets: {
        botApiSecret: String(process.env["API_SECRET"]),
        jwtSecret: String(process.env["JWT_SECRET"]),

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

    databaseUri: String(process.env["DATABASE_URL"]),
    redisString: String(process.env["REDIS_STRING"]),
    discordEndpoint: String(process.env["DISCORD_ENDPOINT"]),

    api: {
        apiPort: Number(process.env["PORT"]) || 3001,
        api_url: String(process.env["API_URL"])
    },
    dashboard: String(process.env["DASHBOARD_URL"]),

    integrations: {
        ...process.env["webhook"] && { webhook: process.env["webhook"] }
    }
} as const;