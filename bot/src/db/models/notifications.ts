import { db } from "../index";

export function getNotificationById(id: string) {
    return db
        .selectFrom("notifications")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
}

export function getNotificationsByGuild(guildId: string) {
    return db
        .selectFrom("notifications")
        .selectAll()
        .where("guild_id", "=", guildId)
        .execute();
}

export function getAllNotifications() {
    return db
        .selectFrom("notifications")
        .selectAll()
        .execute();
}