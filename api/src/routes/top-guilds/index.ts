import { Hono } from "hono";
import pLimit from "p-limit";

import config from "@/src/config";
import { HttpErrorMessage } from "@/src/constants/http-error";
import { httpError } from "@/src/utils/httperrorHandler";

const router = new Hono();

const DISCORD_ENDPOINT = config.discordEndpoint;
const BOT_TOKEN = config.client.token;

interface DiscordGuild {
    id: string;
    name: string;
    icon?: string | null;
    features?: string[];
    approximate_member_count?: number;
    verified?: boolean;
}

const limit = pLimit(3);

async function fetchGuildDetails(id: string, retries = 2): Promise<DiscordGuild | null> {
    try {
        const res = await fetch(`${DISCORD_ENDPOINT}/guilds/${id}?with_counts=true`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`
            }
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        if (retries > 0) {
            return fetchGuildDetails(id, retries - 1);
        }
        console.error("Fetch error for guild", id, err);
        return null;
    }
}

router.get("/", async (c) => {
    try {
        const res = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`
            }
        });

        if (!res.ok) {
            return httpError(HttpErrorMessage.BadRequest);
        }

        const botGuilds = await res.json();

        let totalUsers = 0;

        const allGuilds = await Promise.all(
            botGuilds.map((guild: { id: string; }) =>
                limit(async () => {
                    const full = await fetchGuildDetails(guild.id);
                    if (!full) return null;

                    const memberCount = full.approximate_member_count || 0;
                    totalUsers += memberCount;

                    return {
                        id: full.id,
                        name: full.name,
                        icon: full.icon ?? null,
                        memberCount,
                        verified: full.verified || false,
                        partnered: full.features?.includes("PARTNERED") || false
                    };
                })
            )
        );

        const validGuilds = allGuilds.filter(Boolean);

        return c.json({
            guildCount: validGuilds.length,
            userCount: totalUsers,
            guilds: validGuilds
        });
    } catch (err) {
        console.error(err);
        return httpError(HttpErrorMessage.BadRequest);
    }
});

export default router;