import { ApiClient } from "@twurple/api";
import { StaticAuthProvider } from "@twurple/auth";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;

const authProvider = new StaticAuthProvider(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET);
const apiClient = new ApiClient({ authProvider });

export async function getTwitchUserInfo(username: string): Promise<{ id: string; avatarUrl: string; } | null> {
    try {
        const user = await apiClient.users.getUserByName(username);
        if (!user) return null;

        return {
            id: user.id,
            avatarUrl: user.profilePictureUrl
        };
    } catch (error) {
        console.error("Error fetching Twitch user info:", error);
        return null;
    }
}