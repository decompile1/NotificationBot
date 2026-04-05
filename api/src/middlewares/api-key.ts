import type { MiddlewareHandler } from "hono";

export const apiKeyMiddleware: MiddlewareHandler = async (c, next) => {
    const apikeyheader = c.req.header("apikey");
    const API_SECRET = process.env.API_SECRET;

    if (!apikeyheader || apikeyheader !== API_SECRET) {
        return c.json({ message: "Invalid or missing API key" }, 401);
    }

    await next();
};