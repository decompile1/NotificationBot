import { db } from "../index";
import type { ByeTable } from "../types";

export function getBye(guildId: string) {
    return db
        .selectFrom("bye")
        .selectAll()
        .where("guild_id", "=", guildId)
        .executeTakeFirst();
}

export function createBye(data: Omit<ByeTable, "created_at" | "updated_at">) {
    return db
        .insertInto("bye")
        .values(data)
        .returningAll()
        .executeTakeFirst();
}

export function updateBye(
    guildId: string,
    updates: Partial<Omit<ByeTable, "created_at" | "updated_at">>
) {
    return db
        .updateTable("bye")
        .set(updates)
        .where("guild_id", "=", guildId)
        .executeTakeFirst();
}