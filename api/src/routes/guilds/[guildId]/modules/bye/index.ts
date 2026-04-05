import { Hono } from "hono";

import appConfig from "@/src/config";
import { HttpErrorMessage } from "@/src/constants/http-error";
import { createBye, getBye, updateBye } from "@/src/db/models/bye";
import type { ByeTable } from "@/src/db/types";
import { httpError } from "@/src/utils/httperrorHandler";
import type { ApiV1GuildsModulesByeGetResponse, GuildEmbed } from "@/typings";

const router = new Hono();

interface TestPayload {
    content?: string;
    embeds?: GuildEmbed[];
}

router.get("/", async (c) => {
    const guildId = c.req.param("guildId");

    try {
        const config = await getBye(guildId!);

        return c.json({
            enabled: config?.enabled ?? false,
            channelId: config?.channel_id ?? null,
            webhookURL: config?.webhook_url ?? null,

            message: {
                content: config?.message?.content ?? null,
                embed: config?.message?.embed ?? null
            },

            delete_after: config?.delete_after ?? 0,

            card: {
                enabled: config?.card?.enabled ?? false,
                inEmbed: config?.card?.in_embed ?? false,
                background: config?.card?.background ?? null,
                textColor: config?.card?.text_color ?? null
            }
        });
    } catch (error) {
        console.error("Error fetching welcome configuration:", error);
    }
});

router.patch("/", async (c) => {
    const guildId = c.req.param("guildId");
    const updateData: Partial<Omit<ByeTable, "createdAt" | "updatedAt">> = {};

    const body = await c.req.json() as ApiV1GuildsModulesByeGetResponse;

    try {
        let config = await getBye(guildId!);
        if (config) {
            if (typeof body.enabled === "boolean") {
                updateData.enabled = body.enabled;
            }

            if ("channelId" in body) {
                updateData.channel_id = body.channelId ?? null;
            }

            if ("webhookURL" in body) {
                updateData.webhook_url = body.webhookURL ?? null;
            }

            if ("delete_after" in body) {
                updateData.delete_after = body.delete_after ?? null;
            }

            if (typeof body.enabled === "boolean") {
                updateData.enabled = body.enabled;
            }
            if ("channelId" in body) {
                updateData.channel_id = body.channelId ?? null;
            }
            if ("webhookURL" in body) {
                updateData.webhook_url = body.webhookURL ?? null;
            }
            if ("delete_after" in body) {
                updateData.delete_after = body.delete_after ?? null;
            }

            if (typeof body.message === "object" && body.message !== null) {
                updateData.message = {
                    content:
                    typeof body.message.content === "string"
                        ? body.message.content
                        : config.message?.content ?? null,
                    embed:
      typeof body.message.embed === "object" && body.message.embed !== null
          ? body.message.embed
          : config.message?.embed ?? undefined
                };
            }

            if (typeof body.card === "object" && body.card !== null) {
                updateData.card = {
                    enabled: typeof body.card.enabled === "boolean"
                        ? body.card.enabled
                        : config.card?.enabled ?? false,
                    in_embed: typeof body.card.inEmbed === "boolean"
                        ? body.card.inEmbed
                        : config.card?.in_embed ?? false,
                    background: "background" in body.card
                        ? body.card.background
                        : config.card?.background ?? undefined,
                    text_color: typeof body.card.textColor === "number"
                        ? body.card.textColor
                        : config.card?.text_color ?? undefined
                };
            }
            await updateBye(guildId!, updateData);
        } else {
        // create if the guild does not have a configuration
            config = await createBye({
                guild_id: guildId!,

                enabled: body.enabled ?? false,
                channel_id: body.channelId ?? null,
                webhook_url: body.webhookURL ?? null,

                message: {
                    content: body.message?.content ?? "😔 It is sad to see you leave {guild.name}, {user.name}. Come back anytime!",
                    embed: body.message?.embed ?? undefined
                },

                delete_after: body.delete_after ?? null,

                card: {
                    enabled: body.card?.enabled ?? false,
                    in_embed: body.card?.inEmbed ?? false,
                    background: body.card?.background ?? undefined,
                    text_color: typeof body.card?.textColor === "number" ? body.card.textColor : undefined
                }
            });
        }

        return c.json({ config: config });
    } catch (error) {
        console.error("Error creating/updating welcome configuration:", error);
    }
});

router.post("/test", async (c) => {
    const guildId = c.req.param("guildId");
    const user = c.get("user");

    try {
        const config = await getBye(guildId!);

        if (!config || !config.channel_id) {
            return httpError(HttpErrorMessage.ChannelNotFound);
        }

        const content = config.message?.content?.trim() || `Hello @${user?.username}`;
        const embed = config.message?.embed ?? null;

        const payload: TestPayload = {};
        if (content) payload.content = content;
        if (embed) payload.embeds = [embed];

        const res = await fetch(`https://discord.com/api/v10/channels/${config.channel_id}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bot ${appConfig.client.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const error = await res.text();
            console.error(error);
        }
        return c.json({ success: true });
    } catch (error) {
        console.error("Error sending test welcome message:", error);
    }
});

export default router;