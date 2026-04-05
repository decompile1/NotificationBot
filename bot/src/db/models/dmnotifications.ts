import { db } from "../index";

export function getDmNotifications(userId?: string) {
    let query = db.selectFrom("dmnotifications").selectAll();

    if (userId) {
        query = query.where("user_id", "=", userId);
    }

    return query.execute();
}