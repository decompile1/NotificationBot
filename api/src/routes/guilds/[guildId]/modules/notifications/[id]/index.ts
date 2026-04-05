import { Hono } from "hono";

import { now } from "@/src/constants/global";
import { HttpErrorMessage } from "@/src/constants/http-error";
import { deleteNotification, getNotificationById, upsertNotification } from "@/src/db/models/notifications";
import { httpError } from "@/src/utils/httperrorHandler";
import type { ApiV1GuildsModulesNotificationsGetResponse } from "@/typings";

const router = new Hono();

router.get("/", async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return httpError(HttpErrorMessage.BadRequest);
    }

    try {
        const config = await getNotificationById(id);
        return c.json({
            id: config?.id ?? null,
            guildId: config?.guild_id ?? null,
            channelId: config?.channel_id ?? null,
            roleId: config?.role_id ?? null,
            type: config?.type ?? null,
            flags: config?.flags ?? null,
            regex: config?.regex ?? null,
            creatorId: config?.creator_id ?? null,
            message: {
                content: config?.message?.content ?? null,
                embed: config?.message?.embed ?? null
            },
            creator: {
                id: config?.creator?.id ?? null,
                username: config?.creator?.username ?? null,
                avatarUrl: config?.creator?.avatar_url ?? null,
                customUrl: config?.creator?.custom_url ?? null
            }
        });
    } catch (error) {
        console.error("Error fetching notification configuration:", error);
    }
});

router.patch("/", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json() as ApiV1GuildsModulesNotificationsGetResponse;

    if (!id) {
        return httpError(HttpErrorMessage.BadRequest);
    }

    try {
        const config = await getNotificationById(id);

        if (!config) {
            return httpError(HttpErrorMessage.BadRequest);
        }

        if (config) {

            if (typeof body.type === "string") {
                config.type = body.type;
            }

            if (typeof body.channelId === "string") {
                config.channel_id = body.channelId;
            }

            if (typeof body.creatorId === "string") {
                config.creator_id = body.creatorId;
            }

            if (typeof body.roleId === "string") {
                config.role_id = body.roleId;
            }

            if (typeof body.regex === "string" || body.regex === null) {
                config.regex = body.regex;
            }

            if (typeof body.flags === "number") {
                config.flags = body.flags;
            }

            if (typeof body.message === "object" && body.message !== null) {
                config.message = {
                    content:
      typeof body.message.content === "string"
          ? body.message.content
          : config.message?.content ?? null,
                    embed:
      typeof body.message.embed === "object" && body.message.embed !== null
          ? body.message.embed
          : config.message?.embed ?? undefined
                };
            }

            if (typeof body.creator === "object" && body.creator !== null) {
                config.creator = {
                    id:
      typeof body.creator.id === "string"
          ? body.creator.id
          : config.creator?.id ?? null,
                    username:
      typeof body.creator.username === "string"
          ? body.creator.username
          : config.creator?.username ?? null,
                    avatar_url:
      typeof body.creator.avatarUrl === "string"
          ? body.creator.avatarUrl
          : config.creator?.avatar_url ?? null,
                    custom_url:
      typeof body.creator.customUrl === "string"
          ? body.creator.customUrl
          : config.creator?.custom_url ?? null
                };
            }
            config.updated_at = now;
            if (!config.created_at) {
                config.created_at = now;
            }


            const updatedConfig = await upsertNotification(config);
            return c.json(updatedConfig);
        }

    } catch {
        return httpError(HttpErrorMessage.BadRequest);
    }
});

router.delete("/", async (c) => {
    const id = c.req.param("id");

    if (!id) {
        return httpError(HttpErrorMessage.BadRequest);
    }

    try {
        const deletedCount = await deleteNotification(id);
        if (!deletedCount) {
            return c.json({ message: "No configuration found for this guild to delete." });
        }
        return c.json({ message: "notification configuration deleted" });
    } catch (error) {
        console.error("Error deleting notification configuration:", error);
    }
});

export default router;