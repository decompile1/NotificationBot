import { Hono } from "hono";

import { HttpErrorMessage } from "@/src/constants/http-error";
import { createDmNotification, deleteDmNotification, getDmNotification, updateDmNotification } from "@/src/db/models/dmnotifications";
import { httpError } from "@/src/utils/httperrorHandler";
import type { ApiV1UsersMeGetResponse } from "@/typings";

const router = new Hono();

type UpdatableFields = "enabled" | "embedcolor" | "source" | "thumbnail" | "text";

router.patch("/", async (c) => {
    const user = c.get("user");

    if (!user?.access_token) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    const body = await c.req.json() as ApiV1UsersMeGetResponse["dmnotifications"];
    console.log(body);

    try {
        let config = await getDmNotification(user.id);

        if (!body) {
            return httpError(HttpErrorMessage.BadRequest);
        }

        if (config) {
            const keys: ("enabled" | "embedcolor" | "source" | "thumbnail" | "text")[] =
                ["enabled", "embedcolor", "source", "thumbnail", "text"];
            const updateData: Partial<typeof body> = {};

            for (const key of keys) {
                if (key in body) {
                    (updateData as Record<UpdatableFields, unknown>)[key] = body[key];
                }
            }

            await updateDmNotification(user.id, updateData);
        } else {
            // Create
            config = await createDmNotification({
                user_id: user.id,
                enabled: body?.enabled ?? false,
                embedcolor: body?.embedcolor ?? 0,
                source: body?.source ?? null,
                thumbnail: body?.thumbnail ?? null,
                text: body?.text ?? "undefined"
            });
        }

        return c.json({
            enabled: body?.enabled,
            embedcolor: config?.embedcolor,
            source: config?.source,
            thumbnail: config?.thumbnail,
            text: config?.text
        });
    } catch (error) {
        console.error("Error creating/updating user dmnotifications configuration:", error);
    }
});

router.delete("/", async (c) => {
    const user = c.get("user");

    if (!user?.access_token) {
        return httpError(HttpErrorMessage.MissingAccess);
    }

    try {
        const deletedCount = await deleteDmNotification(user.id);
        if (!deletedCount) {
            return c.json({ message: "No configuration found to delete." });
        }
        return c.json({ message: "dmnotifications configuration deleted successfully." });
    } catch (error) {
        console.error("Error deleting dmnotifications configuration:", error);
    }
});

export default router;