import type { Insertable } from "kysely";

import { db } from "../index";
import type { Database } from "../types";

export function getNotificationById(id: string) {
    return db
        .selectFrom("notifications")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
}

export function getNotificationByGuild(guildId: string) {
    return db
        .selectFrom("notifications")
        .selectAll()
        .where("guild_id", "=", guildId)
        .execute();
}

const DISALLOWED_UPDATE_COLUMNS = [
    "created_at"
] satisfies (keyof Database["notifications"])[];

export function upsertNotification(notifications: Insertable<Database["notifications"]>) {
    const updateConfig = notifications;

    for (const k of Object.keys(updateConfig) as typeof DISALLOWED_UPDATE_COLUMNS) {
        if (!DISALLOWED_UPDATE_COLUMNS.includes(k)) continue;
        updateConfig[k] = undefined as unknown as never;
    }

    return db
        .insertInto("notifications")
        .values(notifications)
        .onConflict((oc) => oc
            .column("id")
            .doUpdateSet(updateConfig)
        )
        .returningAll()
        .executeTakeFirst() as unknown as Promise<Database["notifications"]>;
}

export function deleteNotification(id: string) {
    return db
        .deleteFrom("notifications")
        .where("id", "=", id)
        .executeTakeFirst();
}