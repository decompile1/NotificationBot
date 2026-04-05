import { Hono } from "hono";

import { HttpErrorMessage } from "@/src/constants/http-error";
import { httpError } from "@/src/utils/httperrorHandler";

import { getAllShards } from "../../db/models/shard";

const router = new Hono();

router.get("/", async (c) => {
    try {
        const shards = await getAllShards();

        if (!shards || shards.length === 0) {
            return c.json({ message: "No shard data available" }, 404);
        }

        return c.json(shards, 200);
    } catch (err) {
        console.error("Error fetching shard data:", err);
        return httpError(HttpErrorMessage.BadRequest);
    }
});

export default router;