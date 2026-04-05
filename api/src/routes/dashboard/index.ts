import { Hono } from "hono";

import dashboardRouter from "./@me";

const router = new Hono();

router.route("/@me", dashboardRouter);

export default router;