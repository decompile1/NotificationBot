import "@nekiro/kick-api";

declare module "@nekiro/kick-api" {
    interface Channel {
        livestream?: {
            id?: number | string;
            session_title?: string;
            category?: { name: string; };
            categories?: { name: string; }[];
            thumbnail?: { url?: string; };
            viewer_count?: number;
            created_at?: string;
        };
        offline_banner_image?: { src?: string; };
        banner_image?: { url?: string; };
        followers_count?: number;
        user?: User;
    }

    interface User {
        id?: number | string;
        username?: string;
        profile_pic?: string;
        profilePic?: string;
        profile_picture?: string;
    }
}