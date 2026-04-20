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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown";
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
    ApiV1GuildsRolesGetResponse,
    ApiV1UsersMeGuildsGetResponse } from "@/typings";
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

    const { data: guildsData } = useQuery({
        queryKey: ["/dashboard/@me/guilds"],
        queryFn: () => getData<ApiV1UsersMeGuildsGetResponse[]>("/dashboard/@me/guilds"),
        ...cacheOptions
    });

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
                    <SidebarHeader className="p-4 mt-50">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton size="lg" className="bg-red-950 hover:bg-red-900 border border-red/5 rounded-xl h-14 transition-colors">
                                            {isLoading ? (
                                                <div className="flex items-center w-full">
                                                    <div className="size-10 rounded-lg bg-red/5 animate-pulse shrink-0" />
                                                    <div className="flex flex-col gap-2 ml-2">
                                                        <div className="h-3 w-24 bg-red/5 animate-pulse rounded" />
                                                        <div className="h-2 w-12 bg-red/5 animate-pulse rounded" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex aspect-square size-10 items-center justify-center rounded-lg overflow-hidden bg-red-400 shrink-0">
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
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-64 ml-4" align="start">
                                        <DropdownMenuLabel className="text-xs text-neutral-500 uppercase tracking-wider">
                                            Your Servers
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {Array.isArray(guildsData) && guildsData.filter((g: ApiV1UsersMeGuildsGetResponse) => g.botInGuild).map((g: ApiV1UsersMeGuildsGetResponse) => (
                                            <DropdownMenuItem key={g.id} asChild>
                                                <Link href={`/dashboard/${g.id}`} className="flex items-center gap-3 cursor-pointer">
                                                    <div className="size-7 rounded-md overflow-hidden bg-red-400 shrink-0 flex items-center justify-center">
                                                        {g.icon ? (
                                                            <ImageReduceMotion
                                                                alt={g.name}
                                                                url={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}`}
                                                                size={32}
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-bold text-white">{g.name?.[0]}</span>
                                                        )}
                                                    </div>
                                                    <span className="text-sm truncate">{g.name}</span>
                                                    {g.id === params.guildId && (
                                                        <span className="ml-auto text-[10px] text-red-400 font-bold uppercase">Current</span>
                                                    )}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard" className="flex items-center gap-2 text-neutral-400">
                                                <HiViewGridAdd className="size-4" />
                                                All Servers
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>

                    <SidebarContent className="mt-1 gap-0">
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
                                                        className="data-[active=true]:bg-red-600/10 data-[active=true]:text-white text-neutral-400 hover:text-white px-4 py-5"
                                                    >
                                                        <Link href={href}>
                                                            <item.icon className={isActive ? "text-red-400" : "text-neutral-500"} size={20} />
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
                                href="/dashboard"
                                title={error.includes("permissions") ? "Access Denied" : "Something went wrong"}
                                description={error}
                                buttons={
                                    <ClientButton>
                                        <Link href="/dashboard" className="flex items-center gap-2">
                                            <HiViewGridAdd /> Return to Dashboard
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