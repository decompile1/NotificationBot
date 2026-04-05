import { Hono } from "hono";

import config from "@/src/config";
import { getAllReviews } from "@/src/db/models/reviews";

const router = new Hono();

const DISCORD_ENDPOINT = config.discordEndpoint;

router.get("/", async (c) => {
    const reviews = await getAllReviews();

    const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
            try {
                const guildRes = await fetch(
                    `${DISCORD_ENDPOINT}/guilds/${review.guild_id}?with_counts=true`,
                    {
                        headers: {
                            Authorization: `Bot ${config.client.token}`
                        }
                    }
                );

                if (!guildRes.ok) {
                    console.error("Failed to fetch guild:", review.guild_id);
                    return null;
                }

                const guild = await guildRes.json();

                return {
                    id: guild.id,
                    name: guild.name ?? null,
                    icon: guild.icon ?? null,
                    banner: guild.banner ?? null,
                    memberCount: guild.approximate_member_count || 0,
                    review: review.review
                };
            } catch (err) {
                console.error("Fetch error for guild", review.guild_id, err);
                return null;
            }
        })
    );

    return c.json(enrichedReviews.filter(Boolean));
});


export default router;