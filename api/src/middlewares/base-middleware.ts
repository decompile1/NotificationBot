import { Hono } from "hono";

import { setReqUser } from "./set-req-user";

const router = new Hono();

router.use("*", setReqUser);
export default router;