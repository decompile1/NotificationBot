import { db } from "../index";
import type { WelcomeTable } from "../types";

export function getWelcome(guildId: string) {
    return db
        .selectFrom("welcome")
        .selectAll()
        .where("guild_id", "=", guildId)
        .executeTakeFirst();
}

export function createWelcome(data: Omit<WelcomeTable, "created_at" | "updated_at">) {
    return db
        .insertInto("welcome")
        .values(data)
        .returningAll()
        .executeTakeFirst();
}

export function updateWelcome(
    guildId: string,
    updates: Partial<Omit<WelcomeTable, "created_at" | "updated_at">>
) {
    return db
        .updateTable("welcome")
        .set(updates)
        .where("guild_id", "=", guildId)
        .executeTakeFirst();
}