import type { APIGuild, PermissionResolvable } from "discord.js";
import { Hono } from "hono";

import config from "@/src/config";
import { HttpErrorMessage } from "@/src/constants/http-error";
import { hasPermissions } from "@/src/lib/checkPerms";
import redis from "@/src/lib/redis";
import { httpError } from "@/src/utils/httperrorHandler";

const router = new Hono();

const DISCORD_ENDPOINT = config.discordEndpoint;

import { getDmNotification } from "@/src/db/models/dmnotifications";

import dmnRouter from "./dmnotifications";
router.route("/dmnotifications", dmnRouter);

router.get("/", async (c) => {
    try {
        const user = c.get("user");

        if (!user?.access_token) {
            return httpError(HttpErrorMessage.MissingAccess);
        }

        const config = await getDmNotification(user.id);

        return c.json({
            dmnotifications: {
                enabled: config?.enabled ?? false,
                embedcolor: config?.embedcolor ?? 0,
                source: config?.source ?? null,
                thumbnail: config?.thumbnail ?? null,
                text: config?.text ?? "You got a new notification from"
            }
        });
    } catch (error) {
        console.error("Error fetching user dmnotifications configuration:", error);
        return httpError(HttpErrorMessage.InternalServerError);
    }
});

router.get("/guilds", async (c) => {
    const user = c.get("user");
    if (!user?.access_token) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const guildsRes = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
        headers: {
            Authorization: `Bearer ${user.access_token}`
        }
    });

    if (!guildsRes.ok) {
        return c.json({ message: "Failed to fetch guilds" });
    }

    const guilds = await guildsRes.json();

    // Filter user's guilds where they have the "ManageGuild" permission
    const filteredGuilds = guilds.filter((guild: { permissions: PermissionResolvable; }) =>
        hasPermissions(guild.permissions, "ManageGuild")
    );

    // Fetch the bot's guilds
    const botGuildsRes = await fetch(`${DISCORD_ENDPOINT}/users/@me/guilds`, {
        headers: {
            Authorization: `Bot ${config.client.token}`
        }
    });

    if (!botGuildsRes.ok) {
        return c.json({ message: "Failed to fetch bot's guilds" });
    }

    const botGuilds = await botGuildsRes.json();

    const guildsWithBot = await Promise.all(
        filteredGuilds.map((guild: APIGuild) => {
            const botInGuild = botGuilds.some((botGuild: APIGuild) => botGuild.id === guild.id);

            return {
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
                botInGuild
            };
        })
    );

    await redis.set(`user-guilds:${user.id}`, JSON.stringify(guildsWithBot), "EX", 600);
    return c.json(guildsWithBot);
});

export default router;