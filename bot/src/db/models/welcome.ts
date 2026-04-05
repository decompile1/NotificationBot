import type { Updateable } from "kysely";

import { db } from "../index";
import type { Database } from "../types";

export function getWelcome(guildId: string) {
    return db
        .selectFrom("welcome")
        .selectAll()
        .where("guild_id", "=", guildId)
        .executeTakeFirst();
}

export function updateWelcome(guildId: string, data: Updateable<Database["welcome"]>) {
    return db
        .updateTable("welcome")
        .set(data)
        .where("guild_id", "=", guildId)
        .executeTakeFirst();
}