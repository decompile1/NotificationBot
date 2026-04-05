import { db } from "../index";

export function getReview(guildId: string) {
    return db
        .selectFrom("reviews")
        .selectAll()
        .where("guild_id", "=", guildId)
        .executeTakeFirst();
}

export function getAllReviews() {
    return db
        .selectFrom("reviews")
        .selectAll()
        .execute();
}