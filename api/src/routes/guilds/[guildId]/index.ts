import { Hono } from "hono";

import config from "@/src/config";
import { HttpErrorMessage } from "@/src/constants/http-error";
import { createFollowUpdates, getFollowUpdates, updateFollowUpdates } from "@/src/db/models/followupdates";
import { httpError } from "@/src/utils/httperrorHandler";
import type { ApiV1GuildsGetResponse } from "@/typings";

const router = new Hono();

const DISCORD_ENDPOINT = config.discordEndpoint;
const TOKEN = config.client.token;

import modulesRouter from "./modules";
router.route("/modules", modulesRouter);

router.get("/", async (c) => {
    const guildId = c.req.param("guildId");

    const user = c.get("user");

    if (!user?.access_token) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    // https://discord.com/developers/docs/resources/guild
    const guildRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}?with_counts=true`, {
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });

    if (!guildRes.ok) {
        return httpError(HttpErrorMessage.GuildFetchError);
    }

    const guild = await guildRes.json();

    const followUpdates = await getFollowUpdates(guildId!);

    return c.json({
        id: guild.id,
        name: guild.name ?? null,
        icon: guild.icon ?? null,
        banner: guild.banner ?? null,
        memberCount: guild.approximate_member_count || 0,
        inviteUrl: `https://discord.com/channels/${guild.id}`,
        description: guild.description ?? null,
        follownewsChannel: {
            id: followUpdates?.channel_id ?? null,
            name: followUpdates?.name ?? null
        }
    });
});

router.get("/channels", async (c) => {
    const guildId = c.req.param("guildId");

    const user = c.get("user");

    if (!user?.access_token) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const channelsRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}/channels`, {
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });

    if (!channelsRes.ok) {
        return httpError(HttpErrorMessage.GuildFetchError);
    }

    const channels = await channelsRes.json();

    return c.json(channels);
});

router.get("/roles", async (c) => {
    const guildId = c.req.param("guildId");

    const user = c.get("user");

    if (!user?.access_token) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const rolesRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}/roles`, {
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });

    if (!rolesRes.ok) {
        return httpError(HttpErrorMessage.GuildFetchError);
    }

    const roles = await rolesRes.json();

    return c.json(roles);
});

router.get("/emojis", async (c) => {
    const guildId = c.req.param("guildId");

    const user = c.get("user");

    if (!user?.access_token) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const emojisRes = await fetch(`${DISCORD_ENDPOINT}/guilds/${guildId}/emojis`, {
        headers: {
            Authorization: `Bot ${TOKEN}`
        }
    });

    if (!emojisRes.ok) {
        return httpError(HttpErrorMessage.GuildFetchError);
    }

    const emojis = await emojisRes.json();

    return c.json(emojis);
});

router.patch("/follow-updates", async (c) => {
    const guildId = c.req.param("guildId");
    const user = c.get("user");

    if (!user?.access_token) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const body = await c.req.json() as ApiV1GuildsGetResponse["follownewsChannel"];

    if (!body || !("channelId" in body)) {
        return httpError(HttpErrorMessage.BadRequest);
    }

    try {
        let config = await getFollowUpdates(guildId!);

        let channelName: string | null = null;
        if (body.channelId) {
            const res = await fetch(`https://discord.com/api/v10/channels/${body.channelId}`, {
                headers: { Authorization: `Bot ${TOKEN}` }
            });

            if (!res.ok) throw new Error("Failed to fetch channel data");
            const channelData = await res.json();
            channelName = channelData.name ?? null;
        }

        const updateData = {
            channel_id: body.channelId ?? null,
            name: channelName
        };

        if (config) {
            await updateFollowUpdates(guildId!, updateData);
        } else {
            config = await createFollowUpdates({
                guild_id: guildId!,
                channel_id: updateData.channel_id,
                name: updateData.name
            });
        }

        return c.json({
            channelId: config?.channel_id,
            name: config?.name
        });

    } catch (error) {
        console.error("Error updating follow-updates:", error);
        return httpError(HttpErrorMessage.ServerError);
    }
});


export default router;