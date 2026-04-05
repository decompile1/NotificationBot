import { db } from "../index";
import type { ShardTable } from "../types";

export function getShards(id: number) {
    return db
        .selectFrom("shard")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
}

export function getAllShards() {
    return db.selectFrom("shard").selectAll().execute();
}

export function upsertShard(
    data: Omit<ShardTable, "created_at" | "updated_at">
) {
    const now = new Date().toISOString();

    return db
        .insertInto("shard")
        .values({
            ...data,
            created_at: now,
            updated_at: now
        })
        .onConflict((oc) =>
            oc.column("id").doUpdateSet({
                name: data.name,
                ping: data.ping,
                uptime: data.uptime,
                memory: data.memory,
                guilds: data.guilds,
                users: data.users,
                updated_at: now
            })
        )
        .executeTakeFirst();
}