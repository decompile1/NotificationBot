import { Hono } from "hono";

import byeRouter from "./bye";
import notificationRouter from "./notifications";
import webhookRouter from "./webhook";
import welcomeRouter from "./welcome";

const router = new Hono();

router.route("/notifications", notificationRouter);
router.route("/webhook", webhookRouter);
router.route("/welcome", welcomeRouter);
router.route("/bye", byeRouter);

export default router;