/* eslint-disable @typescript-eslint/no-explicit-any */
import { BskyAgent } from "@atproto/api";
import axios from "axios";
import { Hono } from "hono";

import appConfig from "@/src/config";
import { now } from "@/src/constants/global";
import { getNotificationByGuild, upsertNotification } from "@/src/db/models/notifications";
import { fetchers } from "@/src/lib/getUploads";
import getYouTubeAvatar from "@/src/lib/youtube";
import { getYtChannelId } from "@/src/lib/youtube";
import { NotificationType } from "@/typings";

const router = new Hono();

import { HttpErrorMessage } from "@/src/constants/http-error";
import { httpError } from "@/src/utils/httperrorHandler";

import notificationIdRouter from "./[id]";
router.route("/:id", notificationIdRouter); // dynamic route


router.get("/", async (c) => {
    const guildId = c.req.param("guildId");

    if (!guildId) {
        return httpError(HttpErrorMessage.ParameterRequired);
    }

    try {
        const configs = await getNotificationByGuild(guildId);

        if (configs.length === 0) {
            return c.json({
                creator: {
                    id: null,
                    username: null,
                    avatarUrl: null,
                    customUrl: null
                }
            });
        }

        return c.json(
            configs.map((config) => ({
                id: config.id ?? null,
                guildId: config.guild_id ?? null,
                channelId: config.channel_id ?? null,
                roleId: config.role_id ?? null,
                type: config.type ?? null,
                flags: config.flags ?? null,
                regex: config.regex ?? null,
                creatorId: config.creator_id ?? null,
                message: {
                    content: config.message?.content ?? null,
                    embed: config.message?.embed ?? null
                },
                creator: {
                    id: config.creator?.id ?? null,
                    username: config.creator?.username ?? "Unknown",
                    avatarUrl: config.creator?.avatar_url ?? null,
                    customUrl: config.creator?.custom_url ?? null
                }
            })));
    } catch (error) {
        console.error("Error fetching notification configuration:", error);
        return httpError(HttpErrorMessage.BadRequest);
    }
});

router.post("/", async (c) => {
    const guildId = c.req.param("guildId");

    try {
        const body = await c.req.json();
        // console.log("Received body:", body);

        const existing = await getNotificationByGuild(guildId!);
        if (existing.length >= 10) {
            return httpError(HttpErrorMessage.MaxGuildsReached);
        }

        const defaultMessage: Record<NotificationType, string> = {
            [NotificationType.YouTube]: "Hey {ping}, **{creator.name}** just posted a new video! {video.link}",
            [NotificationType.Twitch]: "Hey {ping}, **{creator.name}** just went live!\n{stream.link}",
            [NotificationType.Bluesky]: "Hey {ping}, {creator.handle} just posted!\n{post.link}",
            [NotificationType.Reddit]: "Hey {ping}, {author.name} just posted in **{subreddit.name}**!\n{post.link}",
            [NotificationType.GitHub]: "Hey {ping}, new release in **{repo.name}**: {release.title}\n{release.link}",
            [NotificationType.Kick]: "Hey {ping}, **{creator.name}** just went live on Kick!\n{stream.link}"
        };

        async function defaultAvatarUrl(type: NotificationType, creatorId: string): Promise<string | null> {
            switch (type) {
                case NotificationType.YouTube:
                    return await getYouTubeAvatar(creatorId);
                case NotificationType.Twitch:
                    return `https://static-cdn.jtvnw.net/jtv_user_pictures/${creatorId}-profile_image-300x300.png`;
                case NotificationType.Bluesky:
                    return `https://cdn.bsky.app/img/avatar/plain/${creatorId}@jpeg`;
                case NotificationType.Reddit:
                    return "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png";
                case NotificationType.GitHub:
                    const owner = creatorId.split("/")[0];
                    return `https://github.com/${owner}.png`;
                case NotificationType.Kick: {
                    try {
                        const res = await axios.get(`https://kick.com/api/v2/channels/${creatorId}?include=stream`);
                        const avatar = res.data?.user?.profile_pic;
                        return avatar || null;
                    } catch {
                        return null;
                    }
                }
                default:
                    return null;
            }
        }

        let avatarUrl: string | null = null;
        let creatorId: string | null = null;
        let creatorUsername: string | null = null;

        const type = Number(body.type);

        switch (type) {
            case NotificationType.YouTube: {
                if (!body.creatorHandle) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                creatorId = await getYtChannelId(body.creatorHandle);

                if (!creatorId) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                const latestVideo = await fetchers[NotificationType.YouTube]({
                    ...body,
                    creator_id: creatorId
                } as any);

                if (!latestVideo) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                creatorUsername = body.creatorHandle;
                break;
            }

            case NotificationType.Twitch: {
                if (!body.creatorHandle) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                const clientId = appConfig.apiSecrets.twitchClientId;
                const clientSecret = appConfig.apiSecrets.twitchClientSecret;

                if (!clientId || !clientSecret) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                const tokenResp = await axios.post(
                    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
                );
                const accessToken = tokenResp.data.access_token;

                const userResp = await axios.get(
                    `https://api.twitch.tv/helix/users?login=${body.creatorHandle}`,
                    {
                        headers: {
                            "Client-ID": clientId,
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
                const user = userResp.data.data?.[0];
                if (!user) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                creatorId = user.id;
                creatorUsername = body.creatorHandle;
                avatarUrl = user.profile_image_url ?? null;

                await fetchers[NotificationType.Twitch]({
                    ...body,
                    creator: { username: creatorUsername }
                } as any);

                break;
            }

            case NotificationType.Bluesky: {
                if (!body.creatorHandle) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                const agent = new BskyAgent({ service: "https://bsky.social" });

                if (!appConfig.apiSecrets.blueskyIdentifier || !appConfig.apiSecrets.blueskyPassword) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                await agent.login({
                    identifier: appConfig.apiSecrets.blueskyIdentifier,
                    password: appConfig.apiSecrets.blueskyPassword
                });

                const profile = await agent.getProfile({ actor: body.creatorHandle });
                if (!profile.data) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                creatorId = profile.data.did;
                creatorUsername = body.creatorHandle;
                avatarUrl = profile.data.avatar ?? null;

                const latestPost = await fetchers[NotificationType.Bluesky]({
                    ...body,
                    creator: { username: creatorUsername }
                } as any);

                if (!latestPost) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                break;
            }

            case NotificationType.Reddit: {
                if (!body.creatorHandle) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                creatorId = body.creatorHandle;
                creatorUsername = body.creatorHandle;

                const latestRedditPost = await fetchers[NotificationType.Reddit]({
                    ...body,
                    creator: { username: creatorUsername }
                } as any);

                if (!latestRedditPost) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                break;
            }

            case NotificationType.GitHub: {
                if (!body.creatorHandle) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                // Validate format (owner/repo)
                const parts = body.creatorHandle.split("/");
                if (parts.length !== 2) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                const [owner, repo] = parts;
                creatorId = body.creatorHandle; // Use the full owner/repo as ID
                creatorUsername = body.creatorHandle;

                // Verify repository exists
                try {
                    const repoResp = await axios.get(
                        `https://api.github.com/repos/${owner}/${repo}`,
                        {
                            headers: {
                                Accept: "application/vnd.github.v3+json",
                                "User-Agent": "NotificationBot/1.0"
                            },
                            validateStatus: (status) => status < 500
                        }
                    );

                    if (repoResp.status === 404) {
                        return httpError(HttpErrorMessage.BadRequest);
                    }

                    if (repoResp.status !== 200) {
                        return httpError(HttpErrorMessage.BadRequest);
                    }

                } catch (error) {
                    console.error("GitHub verification error:", error);
                    return httpError(HttpErrorMessage.BadRequest);
                }

                break;
            }

            case NotificationType.Kick: {
                if (!body.creatorHandle) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                // Use the fetcher to get creator info
                const creator = await fetchers[NotificationType.Kick](body);

                if (!creator) {
                    return httpError(HttpErrorMessage.BadRequest);
                }

                creatorId = body.creatorHandle;
                creatorUsername = body.creatorHandle;
                avatarUrl =
                    creator.avatar ||
        (creator.creator?.id
            ? `https://files.kick.com/images/user/${creator.creator.id}/profile_image.png`
            : null);

                break;
            }

            default:
                return httpError(HttpErrorMessage.BadRequest);
        }

        if (!creatorId) {
            console.error("Creator ID is null after switch statement");
            return httpError(HttpErrorMessage.BadRequest);
        }

        const config = await upsertNotification({
            id: crypto.randomUUID(),
            guild_id: guildId!,
            channel_id: body.channelId,
            role_id: body.roleId ?? null,
            type: type,
            flags: body.flags ?? 0,
            regex: body.regex ?? null,
            creator_id: creatorId,
            message: {
                content: body.message?.content ?? defaultMessage[type],
                embed: body.message?.embed ?? null
            },
            creator: {
                id: creatorId,
                username: creatorUsername,
                avatar_url: avatarUrl ?? await defaultAvatarUrl(type, creatorId),
                custom_url: body.customUrl ?? null
            },
            created_at: now,
            updated_at: now
        });
        return c.json(config);

    } catch (error) {
        console.error("Error creating/updating notification configuration:", error);
        return c.json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : String(error)
        }, 500);
    }
});

export default router;