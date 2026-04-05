import { Hono } from "hono";
import jwt from "jsonwebtoken";

import config from "@/src/config";
import { getUser, upsertUser } from "@/src/db/models/user";

import { HttpErrorMessage } from "../../constants/http-error";
import { httpError } from "../../utils/httperrorHandler";

const router = new Hono();

const DISCORD_ENDPOINT = config.discordEndpoint;
const CLIENT_ID = config.client.clientId;
const CLIENT_SECRET = config.client.clientSecret;

router.post("/", async (c) => {
    try {
        const { code, redirectUri } = await c.req.json();

        const oauthRes = await fetch(`${DISCORD_ENDPOINT}/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID || "",
                client_secret: CLIENT_SECRET || "",
                grant_type: "authorization_code",
                redirect_uri: redirectUri || "",
                code: typeof code === "string" ? code : ""
            }).toString()
        });

        if (!oauthRes.ok) {
            const oauthError = await oauthRes.text();
            console.error("OAuth Error:", oauthError);
            return c.json({ message: "OAuth error", error: oauthError }, 400);
        }

        const oauthResJson = await oauthRes.json();

        // https://discord.com/developers/docs/resources/user
        const userRes = await fetch(`${DISCORD_ENDPOINT}/users/@me`, {
            headers: {
                Authorization: `Bearer ${oauthResJson.access_token}`
            }
        });

        if (!userRes.ok) {
            const userError = await userRes.text();
            console.error("User Fetch Error:", userError);
            return c.json({ message: "User fetch error", error: userError }, 400);
        }

        const userResJson = await userRes.json();

        const user = await getUser(userResJson.id);
        let payload;

        if (!user) {
            payload = ({
                id: userResJson.id,
                email: userResJson.email,
                username: userResJson.username,
                display_name: userResJson.global_name,
                avatar_hash: userResJson.avatar,
                access_token: oauthResJson.access_token,
                refresh_token: oauthResJson.refresh_token
            });
        } else {
            payload = {
                id: userResJson.id,
                email: userResJson.email,
                username: userResJson.username,
                display_name: userResJson.global_name ?? null,
                avatar_hash: userResJson.avatar ?? null,
                access_token: oauthResJson.access_token,
                refresh_token: oauthResJson.refresh_token
            };
        }

        await upsertUser(payload);

        const token = jwt.sign(
            {
                email: userResJson.email,
                id: userResJson.id,
                username: userResJson.username,
                displayName: userResJson.global_name,
                avatarHash: userResJson.avatar || null
            },
            config.apiSecrets.jwtSecret!,
            { expiresIn: "30d" }
        );

        return c.json({ sessiontoken: token });

    } catch (err) {
        console.error("Error processing sessions data:", err);
        return httpError(HttpErrorMessage.BadRequest);
    }
});

router.get("/", (c) => {
    try {
        const user = c.get("user");

        if (!user?.access_token) {
            return httpError(HttpErrorMessage.MissingAccess);
        }

        return c.json({
            id: user.id,
            email: user.email,
            username: user.username,
            displayName: user.display_name,
            avatarHash: user.avatar_hash
        });
    } catch (err) {
        console.error("Error processing sessions data:", err);
        return httpError(HttpErrorMessage.BadRequest);
    }
});

export default router;