/* eslint-disable @typescript-eslint/no-explicit-any */
import { BskyAgent } from "@atproto/api";
import { client as KickClient } from "@nekiro/kick-api";
import axios from "axios";

import type { ContentData, notificationConfig, NotificationType } from "@/typings";

import appConfig from "../config";

const agent = new BskyAgent({ service: "https://bsky.social" });

async function bskySession() {
    if (!agent.session) {
        await agent.login({
            identifier: appConfig.apiSecrets.blueskyIdentifier,
            password: appConfig.apiSecrets.blueskyPassword
        });
    }
}

const kickClient = new KickClient({
    clientId: appConfig.apiSecrets.kickClientId,
    clientSecret: appConfig.apiSecrets.kickClientSecret
});

async function getRedditToken() {
    const clientId = appConfig.apiSecrets.redditClientId;
    const clientSecret = appConfig.apiSecrets.redditClientSecret;

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenResp = await axios.post(
        "https://www.reddit.com/api/v1/access_token",
        new URLSearchParams({ grant_type: "client_credentials" }).toString(),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
                "User-Agent": `NotificationBot/1.0 (by u/${appConfig.apiSecrets.redditUsername})`
            }
        }
    );

    return tokenResp.data.access_token;
}

// YouTube
async function fetchLatestYouTubeContent(config: notificationConfig): Promise<ContentData | null> {
    try {
        const apiKey = appConfig.apiSecrets.youtubeAPI;
        if (!apiKey) {
            console.error("Missing YouTube API key");
            throw new Error("Missing YouTube API key");
        }

        const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${config.creator_id}&part=snippet,id&order=date&maxResults=1&type=video`;
        console.log(`Fetching YouTube videos from: ${url.replace(apiKey, "API_KEY_HIDDEN")}`);

        const response = await axios.get(url);
        console.log(`YouTube API response status: ${response.status}`);
        console.log("YouTube API response data:", JSON.stringify(response.data, null, 2));

        const item = response.data.items?.[0];
        if (!item) {
            console.warn("No videos found in YouTube response");
            return null;
        }

        const videoId = item.id.videoId;
        const snippet = item.snippet;

        const videoUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoId}&part=statistics,snippet`;
        const videoDetailsResp = await axios.get(videoUrl);
        const videoDetails = videoDetailsResp.data.items?.[0];

        if (!videoDetails) {
            console.warn("No video details found");
            return null;
        }

        return {
            id: videoId,
            videoTitle: snippet.title,
            videoId,
            timestamp: Math.floor(new Date(snippet.publishedAt).getTime() / 1000),
            subscriberCount: videoDetails.statistics?.subscriberCount || "0",
            videoCount: videoDetails.statistics?.videoCount || "0",
            viewCount: videoDetails.statistics?.viewCount || "0",
            channelUrl: `https://youtube.com/channel/${config.creator_id}`,
            link: `https://youtube.com/watch?v=${videoId}`
        };
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const errorReason = err.response?.data?.error?.errors?.[0]?.reason;
            const errorMessage = err.response?.data?.error?.message;

            if (status === 403 && errorReason === "quotaExceeded") {
                console.error("YouTube quota reached");
            } else {
                console.error(
                    `YouTube fetch failed (${status ?? "no status"}): ${errorMessage ?? err.message}`
                );
            }
        } else {
            console.error("YouTube fetch error:", err.message || err);
        }

        return null;
    }
}

// Twitch
async function fetchLatestTwitchContent(config: notificationConfig): Promise<ContentData | null> {
    try {
        const clientId = appConfig.apiSecrets.twitchClientId;
        const clientSecret = appConfig.apiSecrets.twitchClientSecret;
        if (!clientId || !clientSecret) throw new Error("Missing Twitch credentials");

        const tokenResp = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`);
        const accessToken = tokenResp.data.access_token;

        const username = config.creator?.username || (config as any).creatorHandle;
        if (!username) throw new Error("Missing username");

        if (!username) {
            return null;
        }

        const userResp = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: { "Client-ID": clientId, Authorization: `Bearer ${accessToken}` }
        });
        const user = userResp.data.data?.[0];
        if (!user) return null;

        const streamResp = await axios.get(`https://api.twitch.tv/helix/streams?user_id=${user.id}`, {
            headers: { "Client-ID": clientId, Authorization: `Bearer ${accessToken}` }
        });
        const stream = streamResp.data.data?.[0];
        if (!stream) return null; // if offline

        return {
            id: stream.id,
            title: stream.title,
            game: stream.game_name,
            thumbnail: stream.thumbnail_url.replace("{width}", "640").replace("{height}", "360"),
            startedAt: Math.floor(new Date(stream.started_at).getTime() / 1000),
            link: `https://twitch.tv/${username}`
        };
    } catch (err) {
        console.error("Twitch fetch error:", err);
        return null;
    }
}

// Bluesky
export async function fetchLatestBlueskyContent(
    config: notificationConfig
): Promise<ContentData | null> {
    try {
        await bskySession();

        const blueskyHandle = config.creator?.username || (config as any).creatorHandle;
        if (!blueskyHandle) throw new Error("Missing blueskyHandle");

        const feed = await agent.getAuthorFeed({ actor: blueskyHandle, limit: 1 });
        const item = feed.data.feed?.[0];
        if (!item) return null;

        const post = item.post; // PostView
        const author = post.author; // ProfileViewBasic

        return {
            id: post.cid,
            type: post.$type,
            text: (post.record as any)?.text || "",
            timestamp: Math.floor(new Date(post.indexedAt).getTime() / 1000),
            creator: {
                posts: (author as any).postsCount || 0,
                followers: (author as any).followersCount || 0
            },
            link: `https://bsky.app/profile/${blueskyHandle}/post/${post.cid}`
        };
    } catch (err) {
        console.error("Bluesky fetch error:", err);
        return null;
    }
}


// Reddit
async function fetchLatestRedditContent(config: notificationConfig): Promise<ContentData | null> {
    try {
        const subreddit = config.creator?.username || (config as any).creatorHandle;
        if (!subreddit) throw new Error("Missing subreddit name");

        const token = await getRedditToken();

        const response = await axios.get(
            `https://oauth.reddit.com/r/${subreddit}/new.json?limit=1&raw_json=1`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "User-Agent": `web:notificationbot:1.0.0 (by /u/${appConfig.apiSecrets.redditUsername})`,
                    "X-OAuth-Client-ID": appConfig.apiSecrets.redditClientId,
                    Accept: "application/json"
                },
                validateStatus: () => true
            }
        );

        const post = response.data?.data?.children?.[0]?.data;
        if (!post) {
            console.warn(`[Reddit] No valid post found for: r/${subreddit}`, response.data);
            return null;
        }

        return {
            id: post.id,
            title: post.title,
            text: post.selftext || "",
            thumbnail: post.thumbnail && post.thumbnail.startsWith("http") ? post.thumbnail : "",
            flair: post.link_flair_text || "",
            timestamp: post.created_utc,
            author: {
                username: post.author,
                id: post.author_fullname || ""
            },
            subreddit: {
                name: `r/${subreddit}`,
                id: post.subreddit_id,
                members: "0"
            },
            link: `https://reddit.com${post.permalink}`
        };
    } catch (err) {
        console.error("Reddit fetch error:", err);
        return null;
    }
}

// GitHub
async function fetchLatestGitHubContent(config: notificationConfig): Promise<ContentData | null> {
    try {
        const repoHandle = config.creator?.username || (config as any).creatorHandle;
        if (!repoHandle) throw new Error("Missing repository handle");

        const [owner, repo] = repoHandle.split("/");
        if (!owner || !repo) throw new Error("Invalid repository format");

        // GitHub API doesn't require authentication for public repos
        const headers: Record<string, string> = {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "NotificationBot/1.0"
        };

        if (appConfig.apiSecrets.githubToken) {
            headers["Authorization"] = `Bearer ${appConfig.apiSecrets.githubToken}`;
        }

        // Fetch latest release
        const releaseResp = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
            {
                headers,
                validateStatus: (status) => status === 200 || status === 404
            }
        );

        if (releaseResp.status === 200 && releaseResp.data) {
            const release = releaseResp.data;
            return {
                id: release.id.toString(),
                title: release.name || release.tag_name,
                text: release.body || "",
                tag: release.tag_name,
                timestamp: Math.floor(new Date(release.published_at).getTime() / 1000),
                author: {
                    username: release.author.login,
                    avatarUrl: release.author.avatar_url
                },
                repository: {
                    name: `${owner}/${repo}`,
                    stars: 0,
                    url: `https://github.com/${owner}/${repo}`
                },
                link: release.html_url
            };
        }

        // If no releases, fetch latest commit from default branch
        const repoResp = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}`,
            { headers }
        );

        if (!repoResp.data) return null;

        const defaultBranch = repoResp.data.default_branch || "main";

        const commitResp = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits/${defaultBranch}`,
            { headers }
        );

        if (!commitResp.data) return null;

        const commit = commitResp.data;

        return {
            id: commit.sha,
            title: commit.commit.message.split("\n")[0], // First line of commit message
            text: commit.commit.message,
            timestamp: Math.floor(new Date(commit.commit.author.date).getTime() / 1000),
            author: {
                username: commit.author?.login || commit.commit.author.name,
                avatarUrl: commit.author?.avatar_url || ""
            },
            repository: {
                name: `${owner}/${repo}`,
                stars: repoResp.data.stargazers_count || 0,
                url: `https://github.com/${owner}/${repo}`
            },
            link: commit.html_url
        };

    } catch (err) {
        console.error("GitHub fetch error:", err);
        return null;
    }
}

// Kick
export async function fetchLatestKickContent(config: notificationConfig): Promise<ContentData | null> {
    try {
        const username = config.creator?.username || (config as any).creatorHandle;
        if (!username) throw new Error("Missing Kick username");

        const data = await kickClient.channels.getChannel(username);

        if (!data) {
            return null;
        }

        const user = data.user ?? {};
        const livestream = data.livestream ?? null;

        const avatar =
            user.profile_pic ||
            (user.id ? `https://files.kick.com/images/user/${user.id}/profile_image.png` : "");


        const baseData: ContentData = {
            id: livestream?.id?.toString() || `${username}-offline`,
            title: livestream?.session_title || `${user.username || username} on Kick`,
            category: livestream?.category?.name || livestream?.categories?.[0]?.name || "Just Chatting",
            thumbnail:
        livestream?.thumbnail?.url ||
        "",
            startedAt: livestream?.created_at
                ? Math.floor(new Date(livestream.created_at).getTime() / 1000)
                : Math.floor(Date.now() / 1000),

            viewerCount: livestream?.viewer_count ?? 0,
            link: `https://kick.com/${username}`,
            avatar,
            creator: {
                username: user?.username || username,
                id: user?.id?.toString() || "",
                followers: data?.followers_count ?? 0
            }
        };

        return baseData;

    } catch (err: any) {
        console.error("Kick fetch error:", err.message || err);
        return null;
    }
}

export const fetchers: Record<
    NotificationType,
    (config: notificationConfig) => Promise<ContentData | null>
> = {
    0: fetchLatestYouTubeContent,
    1: fetchLatestTwitchContent,
    2: fetchLatestBlueskyContent,
    3: fetchLatestRedditContent,
    4: fetchLatestGitHubContent,
    5: fetchLatestKickContent
};