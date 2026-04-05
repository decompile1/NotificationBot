import { defaultFetchOptions } from "@/lib/api";
import type { ApiError } from "@/typings";

export interface ApiCluster {
    id: number;
    name: string;
    ping: number;
    uptime: string;
    memory: number;
    guilds: number;
    users: number;
}

export async function getStatus(): Promise<ApiCluster[] | ApiError | undefined> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/status`,
        {
            ...defaultFetchOptions,
            next: { revalidate: 60 }
        }
    );

    const data: ApiCluster[] = await res.json();
    return data;
}