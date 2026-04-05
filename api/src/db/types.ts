import type { Generated } from "kysely";

import type { GuildEmbed } from "@/typings";

export interface ByeTable {
    guild_id: string;
    enabled: boolean | null;
    channel_id: string | null;
    webhook_url: string | null;

    message: {
        content: string | null;
        embed?: GuildEmbed;
    } | null;

    delete_after: number | null;

    card: {
        enabled: boolean;
        in_embed: boolean;
        background?: string;
        text_color?: number;
    } | null;

    created_at?: string;
    updated_at?: string;
}

export interface DmNotificationsTable {
    user_id: string;
    enabled: boolean | null;
    embedcolor: number | null;
    source: string | null;
    thumbnail: string | null;
    text: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface FollowUpdatesTable {
    guild_id: string;
    channel_id: string | null;
    name: string | null;
}

export interface NotificationsTable {
    id: Generated<string>;
    guild_id: string;
    channel_id: string | null;
    role_id: string | null;
    type: 0 | 1 | 2 | 3 | 4 | 5 | null;
    flags: number | null;
    regex: string | null;
    creator_id: string | null;

    message: {
        content: string | null;
        embed?: GuildEmbed;
    } | null;

    creator: {
        id: string | null;
        username: string | null;
        custom_url: string | null;
        avatar_url: string | null;
    } | null;

    created_at?: string;
    updated_at?: string;
}

export interface ReviewsTable {
    guild_id: string;
    name: string | null;
    icon: string | null;
    member_count: number | null;
    review: string | null;

    created_at?: string;
    updated_at?: string;
}

export interface UserTable {
    id: string | null;
    email: string | null;
    username: string | null;
    display_name: string | null;
    avatar_hash: string | null;
    access_token: string;
    refresh_token: string;

    created_at?: string;
    updated_at?: string;
}

export interface WelcomeTable {
    guild_id: string;
    enabled: boolean | null;
    channel_id: string | null;

    message: {
        content: string | null;
        embed?: GuildEmbed;
    } | null;

    role_ids: string | null;
    ping_ids: string | null;

    delete_after: number | null;
    delete_after_leave: boolean | null;
    is_restorable: boolean;

    dm: {
        enabled: boolean;
        message: {
            content?: string;
            embed?: GuildEmbed;
        };
    } | null;

    reactions: {
        welcome_message_emojis: string[];
        first_message_emojis: string[];
    } | null;

    card: {
        enabled: boolean;
        in_embed: boolean;
        background?: string;
        text_color?: number;
    } | null;

    button: {
        enabled: boolean;
        style: 1 | 2 | 3 | 4;
        emoji?: string | null;
        label?: string | null;
        ping?: boolean;
        type: 0;
    } | null;

    welcome_message_ids: Record<string, string> | null;

    created_at?: string;
    updated_at?: string;
}

export interface ShardTable {
    id: number;
    name: string;
    ping: number;
    uptime: string;
    memory: number;
    guilds: number;
    users: number;
    created_at: string;
    updated_at: string;
}

export interface Database {
    bye: ByeTable;
    dmnotifications: DmNotificationsTable;
    followupdates: FollowUpdatesTable;
    notifications: NotificationsTable;
    reviews: ReviewsTable;
    user: UserTable;
    welcome: WelcomeTable;
    shard: ShardTable;
}