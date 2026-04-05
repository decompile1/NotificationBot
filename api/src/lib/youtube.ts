/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "../config";

export default async function getYouTubeAvatar(creatorId: string): Promise<string | null> {
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${creatorId}&key=${config.apiSecrets.youtubeAPI}`);
        const data = await res.json();
        return data?.items?.[0]?.snippet?.thumbnails?.high?.url ?? null;
    } catch {
        return null;
    }
}

export async function getYtChannelId(creatorHandle: string): Promise<string | null> {
    try {
        const apiKey = config.apiSecrets.youtubeAPI;
        if (!apiKey) {
            console.error("YouTube API key is not configured");
            return null;
        }

        // will try 3 methods to resolve channel id using handle
        // Remove @ symbol if present
        const cleanHandle = creatorHandle.replace(/^@/, "");

        // Method 1: Try forHandle parameter (for modern YouTube handles)
        const handleRes = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${cleanHandle}&key=${apiKey}`
        );
        const handleData = await handleRes.json();

        if (handleData?.items?.[0]?.id) {
            return handleData.items[0].id;
        }

        // Method 2: Try forUsername parameter (for legacy usernames)
        const usernameRes = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${cleanHandle}&key=${apiKey}`
        );
        const usernameData = await usernameRes.json();

        if (usernameData?.items?.[0]?.id) {
            return usernameData.items[0].id;
        }

        // Method 3: Try search as fallback
        const query = encodeURIComponent(cleanHandle);
        const searchRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${query}&maxResults=5&key=${apiKey}`
        );
        const searchData = await searchRes.json();

        // Look for exact match in search results
        if (searchData?.items && searchData.items.length > 0) {
            // Try to find an exact match by title or custom URL
            const exactMatch = searchData.items.find((item: any) => {
                const title = item.snippet?.title?.toLowerCase();
                const customUrl = item.snippet?.customUrl?.toLowerCase();
                const searchTerm = cleanHandle.toLowerCase();

                return title === searchTerm ||
                       customUrl === `@${searchTerm}` ||
                       customUrl === searchTerm;
            });

            if (exactMatch?.id?.channelId) {
                return exactMatch.id.channelId;
            }

            // If no exact match, return first result
            const firstResult = searchData.items[0]?.id?.channelId;
            if (firstResult) {
                return firstResult;
            }
        }

        console.error(`Could not find YouTube channel for: ${creatorHandle}`);
        return null;

    } catch (error) {
        console.error("Error fetching YouTube channel ID:", error);
        return null;
    }
}