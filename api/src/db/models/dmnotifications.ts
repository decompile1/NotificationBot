import { db } from "../index";
import type { DmNotificationsTable } from "../types";

export function getDmNotification(userId: string) {
    return db
        .selectFrom("dmnotifications")
        .selectAll()
        .where("user_id", "=", userId)
        .executeTakeFirst();
}

export function createDmNotification(data: Omit<DmNotificationsTable, "created_at" | "updated_at">) {
    return db
        .insertInto("dmnotifications")
        .values(data)
        .returningAll()
        .executeTakeFirst();
}

export function updateDmNotification(
    userId: string,
    updates: Partial<Omit<DmNotificationsTable, "user_id" | "created_at" | "updated_at">>
) {
    return db
        .updateTable("dmnotifications")
        .set(updates)
        .where("user_id", "=", userId)
        .executeTakeFirst();
}

export function deleteDmNotification(userId: string) {
    return db
        .deleteFrom("dmnotifications")
        .where("user_id", "=", userId)
        .executeTakeFirst();
}