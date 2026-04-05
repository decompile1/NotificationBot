import { Hono } from "hono";

import guildIdRouter from "./[guildId]";

const router = new Hono();

router.route("/:guildId", guildIdRouter); // dynamic route

export default router;