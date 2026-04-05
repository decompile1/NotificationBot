import type { Insertable } from "kysely";

import { db } from "../index";
import type { Database } from "../types";

export function getUser(id: string) {
    return db
        .selectFrom("user")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
}

const DISALLOWED_UPDATE_COLUMNS = [
    "created_at"
] satisfies (keyof Database["user"])[];

export function upsertUser(user: Insertable<Database["user"]>) {
    if (!user.id) {
        throw new Error("upsertUser: 'id' is required");
    }

    const userUpdate = { ...user };

    for (const k of Object.keys(userUpdate) as typeof DISALLOWED_UPDATE_COLUMNS) {
        if (!DISALLOWED_UPDATE_COLUMNS.includes(k)) continue;
        userUpdate[k] = undefined as unknown as never;
    }

    return db
        .insertInto("user")
        .values(user)
        .onConflict((oc) => oc
            .column("id")
            .doUpdateSet(userUpdate)
        )
        .returningAll()
        .executeTakeFirst() as unknown as Promise<Database["user"]>;
}