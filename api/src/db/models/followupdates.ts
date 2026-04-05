import { db } from "../index";
import type { FollowUpdatesTable } from "../types";

export function getFollowUpdates(guildId: string) {
    return db
        .selectFrom("followupdates")
        .selectAll()
        .where("guild_id", "=", guildId)
        .executeTakeFirst();
}

export function createFollowUpdates(data: Omit<FollowUpdatesTable, "createdAt" | "updatedAt">) {
    return db
        .insertInto("followupdates")
        .values(data)
        .returningAll()
        .executeTakeFirst();
}

export function updateFollowUpdates(
    guildId: string,
    updates: Partial<Omit<FollowUpdatesTable, "guildId" | "createdAt" | "updatedAt">>
) {
    return db
        .updateTable("followupdates")
        .set(updates)
        .where("guild_id", "=", guildId)
        .executeTakeFirst();
}