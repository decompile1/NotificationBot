"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useMemo, useState } from "react";
import { HiRefresh, HiUserAdd, HiViewGridAdd } from "react-icons/hi";

import Smartinput from "@/components/input/smart-input";
import { HomeButton, ScreenMessage, SupportButton } from "@/components/screen-message";
import { Button } from "@/components/ui/button";
import ImageReduceMotion from "@/components/ui/reducemotion";
import { useApi } from "@/lib/api/hooks";
import type { ApiV1UsersMeGuildsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";

const MAX_GUILDS = 100 as const;

const springAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.7
        }
    }
} as const;

export default function Home() {
    const [search, setSearch] = useState<string>("");

    const cookies = useCookies();

    const { isLoading, data, error } = useApi<ApiV1UsersMeGuildsGetResponse[]>("/dashboard/@me/guilds");

    const guilds = useMemo(
        () =>
            Array.isArray(data)
                ? data
                    .sort(sort)
                    .filter((guild) => filter(guild, search))
                    .slice(0, MAX_GUILDS)
                : [],
        [data, search]
    );

    if (error) {
        return (
            <ScreenMessage
                top="10rem"
                title="Something went wrong on this page.."
                description={`${error}`}
                buttons={
                    <>
                        <HomeButton />
                        <SupportButton />
                    </>
                }
            ></ScreenMessage>
        );
    }

    if (isLoading || !data) return <></>;

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative top-2 w-full">
                    <Smartinput value={search} setValue={setSearch} placeholder="Search by guild name or id" thin />
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild size="sm" variant="secondary">
                        <Link href={"/login?invite=true"} className="flex items-center gap-2">
                            <HiUserAdd className="h-4 w-4" />
                            Add to Server
                        </Link>
                    </Button>

                    <Button asChild size="sm">
                        <Link
                            href="/login"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                        >
                            Refresh
                            <HiRefresh className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {!isLoading && (
                <motion.ul
                    variants={{
                        hidden: { opacity: 1, scale: 0 },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            transition: {
                                delayChildren: guilds.length > 20 ? 0.2 : 0.3,
                                staggerChildren: guilds.length > 20 ? 0.1 : 0.2
                            }
                        }
                    }}
                    initial={cookies.get("reduceMotions") === "true" ? "visible" : "hidden"}
                    animate="visible"
                    className="grid grid-cols-1 gap-3.5 w-full mt-3 lg:grid-cols-3 md:grid-cols-2"
                >
                    {guilds.map((guild) => (
                        <Guild key={"guild-" + guild.id} {...guild} />
                    ))}
                </motion.ul>
            )}

            {guilds.length > MAX_GUILDS && (
                <ScreenMessage
                    title="You have too many servers to process"
                    description={`Use the searchbar to find a guild. Showing ${MAX_GUILDS} out of ~${guilds.length < 1000 ? length : Math.round(length / 1000) * 1000}.`}
                ></ScreenMessage>
            )}
        </div>
    );
}

function sort(a: ApiV1UsersMeGuildsGetResponse, b: ApiV1UsersMeGuildsGetResponse) {
    return a.botInGuild === b.botInGuild ? 0 : a.botInGuild ? -1 : 1;
}

function filter(guild: ApiV1UsersMeGuildsGetResponse, search: string) {
    if (!search) return true;

    if (guild.name?.toLowerCase().includes(search.toLowerCase())) return true;
    if (search.toLowerCase().includes(guild.name?.toLowerCase())) return true;

    if (guild.id.includes(search)) return true;
    if (search.includes(guild.id)) return true;

    return false;
}

function Guild({ id, name, icon, botInGuild }: ApiV1UsersMeGuildsGetResponse) {
    return (
        <motion.li
            className={cn(
                "dark:bg-foreground bg-foreground-100 p-3.5 flex items-center rounded-xl drop-shadow-md overflow-hidden relative duration-100 outline-foreground-500 hover:outline group/card",
                !botInGuild && "saturate-50 brightness-50"
            )}
            variants={springAnimation}
        >
            <ImageReduceMotion
                alt=""
                className="absolute -top-12 left-0 w-full z-0 blur-xl opacity-30 pointer-events-none"
                size={16}
                url={`https://cdn.discordapp.com/icons/${id}/${icon}`}
                forceStatic={true}
            />

            <ImageReduceMotion
                alt={`Server icon of @${name}`}
                className="rounded-lg size-15 z-1 relative drop-shadow-md"
                size={56}
                url={`https://cdn.discordapp.com/icons/${id}/${icon}`}
            />

            <div className="ml-3 text-sm relative bottom-0.5">
                <span className="text-lg dark:text-neutral-200 font-medium text-neutral-800 mb-1 sm:max-w-64 lg:max-w-56 truncate">
                    {name}
                </span>
                <div className="flex gap-1">
                    {botInGuild ? <ManageButton guildId={id} /> : <InviteButton guildId={id} />}
                    {botInGuild}
                </div>
            </div>
        </motion.li>
    );
}

function InviteButton({ guildId }: { guildId: string; }) {
    return (
        <Button
            asChild
            className="bg-neutral-400/40 text-sm h-9 hover:bg-neutral-400/20 dark:bg-neutral-500/40 hover:dark:bg-neutral-500/20"
        >
            <Link href={`/login?invite=true&guild_id=${guildId}`} prefetch={false} className="flex items-center gap-2">
                <HiUserAdd className="h-4 w-4" />
                Add Bot
            </Link>
        </Button>
    );
}

function ManageButton({ guildId }: { guildId: string; }) {
    const searchParams = useSearchParams();
    const toParam = searchParams.get("to");
    const href = `/dashboard/${guildId}${toParam ? `/${toParam}` : ""}`;

    return (
        <Button
            asChild
            className="bg-neutral-400/40 text-sm h-9 hover:bg-neutral-400/20 dark:bg-neutral-500/40 hover:dark:bg-neutral-500/20"
        >
            <Link href={href} className="flex items-center gap-2">
                <HiViewGridAdd className="h-4 w-4" />
                Manage
            </Link>
        </Button>
    );
}