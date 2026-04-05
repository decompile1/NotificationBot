import { db } from "../index";

export function getBye(guildId: string) {
    return db
        .selectFrom("bye")
        .selectAll()
        .where("guild_id", "=", guildId)
        .executeTakeFirst();
}