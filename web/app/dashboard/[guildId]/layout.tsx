/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiBell, HiEmojiHappy, HiHome, HiPaperAirplane, HiViewGridAdd } from "react-icons/hi";

import { guildStore } from "@/common/guildStore";
import { ClientButton } from "@/components/client-ui";
import { ScreenMessage } from "@/components/screen-message";
import ImageReduceMotion from "@/components/ui/reducemotion";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";
import { cacheOptions, getData } from "@/lib/api";
import type { ApiV1GuildsChannelsGetResponse,
    ApiV1GuildsEmojisGetResponse,
    ApiV1GuildsGetResponse,
    ApiV1GuildsRolesGetResponse } from "@/typings";
import { intl } from "@/utils/intl";

function useGuildData<T extends unknown[]>(
    url: string,
    onLoad: (data: T, error: boolean)
    => void
) {
    const query = useQuery({
        queryKey: [url],
        queryFn: () => getData<T>(url),
        enabled: !!guildStore((g) => g)?.id,
        ...cacheOptions
    });

    const { data, isError } = query;

    useEffect(() => {
        const isDataError = !data || "message" in (data as object);

        if (data || isError) {
            onLoad(isDataError ? ([] as unknown as T) : (data as T), isDataError);
        }
    }, [data, isError]);
}

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    const params = useParams();
    const pathname = usePathname();
    const [error, setError] = useState<string>();
    const [loaded, setLoaded] = useState<string[]>([]);

    const guild = guildStore((g) => g);

    // const cookies = useCookies();
    // const session = useMemo(() => cookies.get("sessiontoken="), [cookies]);
    // if (!session) redirect(`/login?callback=/dashboard/${params.guildId}`);

    const url = `/guilds/${params.guildId}` as const;
    const baseUrl = `/dashboard/${params.guildId}`;

    const { data, isLoading } = useQuery({
        queryKey: [url],
        queryFn: () => getData<ApiV1GuildsGetResponse>(url),
        enabled: !!params.guildId,
        ...cacheOptions,
        refetchOnMount: true
    });

    useGuildData<ApiV1GuildsChannelsGetResponse[]>(`${url}/channels`, (data) => {
        guildStore.setState({ ...guild, channels: data });
        setLoaded((loaded) => [...loaded, "channels"]);
    });

    useGuildData<ApiV1GuildsRolesGetResponse[]>(`${url}/roles`, (data) => {
        guildStore.setState({ ...guild, roles: data });
        setLoaded((loaded) => [...loaded, "roles"]);
    });

    useGuildData<ApiV1GuildsEmojisGetResponse[]>(`${url}/emojis`, (data) => {
        guildStore.setState({ ...guild, emojis: data });
        setLoaded((loaded) => [...loaded, "emojis"]);
    });

    useEffect(() => {
        if (!data) return;

        if ("message" in data) {
            setError(data?.message);
            return;
        }

        guildStore.setState(data);
    }, [data]);

    const navGroups = [
        {
            label: "Quick Actions",
            items: [
                { name: "Overview", value: "/", icon: HiHome },
                { name: "Notifications", value: "/notifications", icon: HiBell },
                { name: "Welcomer", value: "/welcomer", icon: HiEmojiHappy },
                { name: "Webhook", value: "/webhook", icon: HiPaperAirplane }
            ]
        }
    ];

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full text-white pt-20">
                {guild?.name && (
                    <Head>
                        <title>{`${guild?.name}'s Dashboard`}</title>
                    </Head>
                )}
                <Sidebar className="border-r border-white/5 bg-discord-gray]">
                    <SidebarHeader className="p-4">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton size="lg" className="bg-[#161b22] hover:bg-[#1c2128] border border-white/5 rounded-xl h-14 transition-colors">
                                    {isLoading ? (
                                        <div className="flex items-center w-full">
                                            <div className="size-10 rounded-lg bg-white/5 animate-pulse shrink-0" />
                                            <div className="flex flex-col gap-2 ml-2">
                                                <div className="h-3 w-24 bg-white/5 animate-pulse rounded" />
                                                <div className="h-2 w-12 bg-white/5 animate-pulse rounded" />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex aspect-square size-10 items-center justify-center rounded-lg overflow-hidden bg-blue-600 shrink-0">
                                                {guild?.id && guild?.icon ? (
                                                    <ImageReduceMotion
                                                        alt="guild icon"
                                                        url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}
                                                        size={128}
                                                    />
                                                ) : (
                                                    <div className="text-3xl text-white font-bold">
                                                        {guild?.name?.[0] || "T"}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-0.5 leading-none ml-2 text-left">
                                                <span className="font-semibold text-white truncate max-w-[130px]">
                                                    {guild?.name || "Loading..."}
                                                </span>
                                                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                                                    {intl.format(guild?.memberCount || 0)} Members
                                                </span>
                                            </div>
                                            <ChevronDown className="ml-auto size-4 text-neutral-500" />
                                        </>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>

                    <SidebarContent className="mt-2 gap-0">
                        {navGroups.map((group) => (
                            <SidebarGroup key={group.label} className="mb-2">
                                <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 px-4 mb-2">
                                    {group.label}
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {group.items.map((item) => {
                                            const href = item.value === "/" ? baseUrl : `${baseUrl}${item.value}`;
                                            const isActive = pathname === href;
                                            return (
                                                <SidebarMenuItem key={item.name}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        isActive={isActive}
                                                        className="data-[active=true]:bg-blue-600/10 data-[active=true]:text-white text-neutral-400 hover:text-white px-4 py-5"
                                                    >
                                                        <Link href={href}>
                                                            <item.icon className={isActive ? "text-blue-500" : "text-neutral-500"} size={20} />
                                                            <span className="text-[13px] font-medium ml-1">{item.name}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))}
                    </SidebarContent>
                </Sidebar>

                <SidebarInset className="bg-transparent flex flex-col w-full">
                    <header className="flex h-16 items-center gap-4 px-6 lg:px-10 border-b border-white/5">
                        <SidebarTrigger className="text-white lg:hidden" />
                    </header>

                    <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                        {error ? (
                            <ScreenMessage
                                href="/profile"
                                title={error.includes("permissions") ? "Access Denied" : "Something went wrong"}
                                description={error}
                                buttons={
                                    <ClientButton>
                                        <Link href="/profile" className="flex items-center gap-2">
                                            <HiViewGridAdd /> Return to Profile
                                        </Link>
                                    </ClientButton>
                                }
                            />
                        ) : (
                            (guild && loaded.length === 3) ? children : (
                                <div className="space-y-4">
                                    <div className="h-8 w-64 bg-white/5 animate-pulse rounded-lg" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="h-40 bg-white/5 animate-pulse rounded-2xl" />
                                        <div className="h-40 bg-white/5 animate-pulse rounded-2xl" />
                                    </div>
                                </div>
                            )
                        )}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}