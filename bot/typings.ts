export interface ContentData {
  id: string;
  link?: string;
  [key: string]: any;
}

export enum NotificationType {
  YouTube = 0,
  Twitch = 1,
  Bluesky = 2,
  Reddit = 3,
  GitHub = 4,
  Kick = 5
}

export interface GuildEmbed {
    title: string | null;
    description: string | null;
    thumbnail: string | null;
    image: string | null;
    color: number;
    footer: {
        text: string | null;
        icon_url: string | null;
    };
}

export type notificationConfig = {
  id: string;
  guild_id: string;
  channel_id: string;
  role_id: string | null;

  type: 0 | 1 | 2 | 3 | 4 | 5;
  flags: number;
  regex: string | null;

  creator_id: string;

  message?: {
    content: string | null;
    embed?: GuildEmbed;
  };

  creator: {
    id: string;
    username: string;
    custom_url: string;
    avatar_url: string | null;
  };
};