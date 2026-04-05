import { Hono } from "hono";

import reviewRouter from "./bot-reviews";
import commandsRouter from "./commands";
import dashboardRouter from "./dashboard";
import guildsRouter from "./guilds";
import sessionsRouter from "./sessions";
import statusRouter from "./status";
import topGuildsRouter from "./top-guilds";

const router = new Hono();

router.route("/dashboard", dashboardRouter);
router.route("/status", statusRouter);
router.route("/bot-reviews", reviewRouter);
router.route("/commands", commandsRouter);
router.route("/sessions", sessionsRouter);
router.route("/top-guilds", topGuildsRouter);
router.route("/guilds", guildsRouter);

export default router;