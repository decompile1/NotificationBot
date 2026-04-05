import { Hono } from "hono";
import welcomeCardRouter from "./welcome-card";

const router = new Hono();

router.route("/welcome-card", welcomeCardRouter);

export default router;