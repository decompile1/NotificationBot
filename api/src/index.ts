import "@dotenvx/dotenvx/config";

import { serve } from "@hono/node-server";
import type { Context } from "hono";
import { Hono } from "hono";
import { every } from "hono/combine";
import { cors } from "hono/cors";
import { rateLimiter } from "hono-rate-limiter";

import config from "./config";
import { HttpErrorCode, HttpErrorMessage } from "./constants/http-error";
import baseMiddleware from "./middlewares/base-middleware";
import baseRouter from "./routes/base-router";

const app = new Hono();
export default app;

app.use(
    "*",
    every(
        rateLimiter({
            windowMs: 10 * 60 * 1000, // 10 minutes
            limit: 30,
            standardHeaders: true,
            keyGenerator: (c) =>
                c.req.header("CF-Connecting-IP") ??
        c.req.header("X-Real-IP") ??
        c.req.header("X-Forwarded-For") ??
        "unknown",
            handler: (c: Context) => {
                return c.json(
                    {
                        status: HttpErrorCode.TooManyRequests,
                        message: HttpErrorMessage.TooManyRequests
                    },
                    HttpErrorCode.TooManyRequests
                );
            }
        }),
        cors({
            origin: config.dashboard,
            credentials: true,
            exposeHeaders: ["Set-Cookie"]
        })
    )
);

app.route("/", baseMiddleware);
app.route("/", baseRouter);

app.all("/*", () => {
    return Response.json(
        {
            status: HttpErrorCode.NotFound,
            message: HttpErrorMessage.NotFound
        },
        {
            status: HttpErrorCode.NotFound
        }
    );
});

const PORT = config.api.apiPort;

serve({
    fetch: app.fetch,
    port: PORT
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});