import Image from "next/image";
import Link from "next/link";
import { BsDiscord, BsSlashCircleFill } from "react-icons/bs";
import { FaDoorOpen } from "react-icons/fa6";
import { HiArrowNarrowDown } from "react-icons/hi";
import { HiArrowRight, HiCheck } from "react-icons/hi";
import { LuBellElectric, LuGrid2X2Plus } from "react-icons/lu";
import { RiRobot2Line } from "react-icons/ri";

import DiscordMessageEmbed from "@/components/discord/embed";
import { DiscordMarkdown } from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import { AvatarGroup, UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { defaultFetchOptions } from "@/lib/api";
import ArrowPic from "@/public/arrow.webp";
import thumbnail from "@/public/assets/thumbnail.png";
import type { ApiV1TopguildsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";
import { toFixedArrayLength } from "@/utils/fixed-array";
import { handwritten, montserrat } from "@/utils/font";

import { Faq } from "./faq.component";

const styles = {
    h2: cn(montserrat.className, "lg:text-5xl text-4xl bg-gradient-to-b bg-clip-text text-transparent from-blue-900 from-40% to-blue-500 font-bold mb-4"),
    h3: cn(montserrat.className, "lg:text-2xl text-xl bg-gradient-to-b bg-clip-text text-transparent from-blue-900 from-40% to-blue-500 font-semibold"),
    h4: cn(montserrat.className, "lg:text-2xl text-xl bg-clip-text text-transparent text-white font-semibold")
};

const messageProps = (command?: string) => ({
    mode: "DARK" as const,
    commandUsed: command
        ? {
            name: command,
            username: "@decompile1",
            avatar: "/user.webp",
            bot: false
        }
        : undefined,
    user: {
        username: "NotificationBot",
        avatar: "/bot.webp",
        bot: true
    }
});

export default async function Home() {
    const data: ApiV1TopguildsGetResponse | null = await fetch(
        `${process.env.NEXT_PUBLIC_API}/top-guilds`,
        defaultFetchOptions
    )
        .then((res) => res.json())
        .catch(() => null);

    return (
        <div className="flex flex-col items-center w-full">

            <div className="flex w-full items-center justify-center gap-8 mb-8 mt-70 md:mb-10 min-h-[500px] h-fit py-20">
                <div className="md:min-w-96 w-full md:w-3/4 flex flex-col items-center text-center space-y-6">
                    <h1 className={cn(montserrat.className, "lg:text-7xl md:text-6xl text-5xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight")}>
                        <span className="bg-linear-to-r from-red-900 to-red-600 bg-clip-text text-transparent">
                            Next Generation
                        </span>{" "}
                        of{" "}
                        <span className="inline-flex items-center">
                            Discord Notifications
                        </span>
                    </h1>

                    <span className="text-2xl font-medium max-w-152 mb-4 leading-tight">
                        We introduce you to fully customizable notifications from your favorite platforms,
                        a full-on welcoming system, and slash commands!
                    </span>

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Button asChild size="lg">
                                <Link
                                    href="https://discord.com/oauth2/authorize?client_id=1366507117044957276"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <BsDiscord className="w-5 h-5" />
                                    Invite NotificationBot
                                </Link>
                            </Button>

                            <Button asChild size="lg">
                                <Link
                                    href="/dashboard"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <LuGrid2X2Plus className="w-5 h-5" />
                                    Dashboard
                                </Link>
                            </Button>
                        </div>

                        <span className={cn("lg:ml-auto flex gap-2 text-neutral-500 font-medium opacity-80 pl-20 lg:pr-20 rotate-2 scale-110 relative pt-0.5", handwritten.className)}>
                            <Image
                                src={ArrowPic}
                                width={24}
                                height={24}
                                alt="arrow up"
                                className="h-5 w-5"
                                draggable={false}
                            />
                            Add NotificationBot to get started!
                        </span>
                    </div>
                    {data && data.guilds && data.guilds.length > 0 && (
                        <div className="mx-auto flex flex-col items-center gap-3">
                            <div className="flex items-center justify-center gap-3">
                                <AvatarGroup className="mr-auto">
                                    {toFixedArrayLength(data.guilds, 8).map((guild) => (
                                        <UserAvatar
                                            key={"homeGuildGrid-" + guild.id}
                                            alt={guild.name}
                                            className="-mr-2"
                                            src={
                                                guild.icon
                                                    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`
                                                    : "/discord.webp"
                                            }
                                        />
                                    ))}
                                </AvatarGroup>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                    and trusted by <strong>{data.guildCount.toLocaleString()}</strong> others
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                {/* <div className="ml-auto w-fit xl:w-1/2 hidden md:block">
                    <div className="flex gap-4 justify-end xl:relative xl:left-14 w-full xl:w-fit">
                        <MessageAnimation />
                    </div>
                </div> */}
            </div>
            {/* <div className="block md:hidden w-full">
                <div className="flex justify-center">
                    <MessageAnimation />
                </div>
            </div> */}

            <div className="flex justify-center w-full mt-1 mb-10 md:mb-90">
                <div className="flex flex-col items-center gap-2">
                    <HiArrowNarrowDown className="w-8 h-8 text-white animate-bounce" />
                </div>
            </div>

            <article
                itemScope
                itemType="http://schema.org/Article"
                className="flex flex-col gap-28 my-10"
            >
                <div className="flex flex-col items-center justify-center gap-4 mb-12 text-center">
                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
                        Features
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white max-w-3xl leading-tight">
                        Explore the features that make Tickets the best ticket bot for Discord communities.
                    </h2>
                </div>
                <div>
                    <div className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2 flex flex-col items-start">
                            <div className="mb-6 flex items-center justify-center size-12 rounded-xl bg-white/3 border border-white/8 shadow-inner relative overflow-hidden group">
                                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-50" />

                                <LuBellElectric className="size-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                            </div>

                            <h3 className={styles.h4}>Notifications from your favorite platforms</h3>

                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCheck />
                                Free
                            </Badge>

                            <div className="pt-6">
                                Setup notifications for your favorite sites like YouTube, TikTok, and Twitch. No slash commands needed!
                            </div>

                            <div className="flex gap-2 mt-5">
                                <Button asChild>
                                    <Link
                                        href="/dashboard?to=notifications"
                                        target="_blank"
                                    >
                                        <HiArrowRight />
                                        Setup
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps()}>
                                <DiscordMarkdown
                                    mode="DARK"
                                    text={"Hey **@everyone**, MrBeast just uploaded a new video!\n[https://www.youtube.com/watch?v=0e3GPea1Tyg&vl](https://www.youtube.com/watch?v=0e3GPea1Tyg&vl)"}
                                />
                                <DiscordMessageEmbed mode="DARK" title="$456000 Squid Game in Real Life!" color={0xFF0000}>
                                    <Image
                                        alt=""
                                        className="rounded-md shadow-md w-full mt-2"
                                        itemProp="image"
                                        loading="lazy"
                                        src={thumbnail}
                                    />
                                </DiscordMessageEmbed>
                            </DiscordMessage>

                            <span className="text-sm mt-1 opacity-75">
                                Example message
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2 flex flex-col items-start">
                            <div className="mb-6 flex items-center justify-center size-12 rounded-xl bg-white/3 border border-white/8 shadow-inner relative overflow-hidden group">
                                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-50" />

                                <FaDoorOpen className="size-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                            </div>

                            <h3 className={styles.h4}>Welcome System</h3>

                            <div className="pt-6">
                                Automatic messages for new and leaving members. Supports direct messages.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Button asChild>
                                    <Link
                                        href="/dashboard?to=welcomer"
                                        target="_blank"
                                    >
                                        <HiArrowRight />
                                        Setup
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps()}>
                                <DiscordMarkdown mode={"DARK"} text="Welcome **@decompile1** to **a very special server** 👋" />
                                <Image
                                    alt="example welcome card"
                                    className="rounded-md shadow-md w-full mt-2"
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_API}/welcome-card?type=welcome&username=explosiveapple&members=1000&hash=e310ef650877b405e4e953eb59aa58d9&id=1255569584925315205&background=${encodeURIComponent("https://notificationbot.top/static/gameroom.jpg")}`}
                                    itemProp="image"
                                    loading="lazy"
                                    width={1024}
                                    height={512}
                                />
                            </DiscordMessage>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <div className="mb-6 flex items-center justify-center size-12 rounded-xl bg-white/3 border border-white/8 shadow-inner relative overflow-hidden group">
                                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-50" />

                                <RiRobot2Line className="size-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                            </div>

                            <h3 className={styles.h4}>Webhooks</h3>

                            <div className="pt-6">
                                Easily send a message with a webhook right in the dashboard!
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Button asChild>
                                    <Link
                                        href="/dashboard?to=webhook"
                                        target="_blank"
                                    >
                                        <HiArrowRight />
                                        Setup
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg flex flex-col gap-4">
                            <DiscordMessage
                                mode={"DARK"}
                                user={{
                                    username: "decompile1",
                                    avatar: "/user.webp",
                                    bot: false
                                }}
                            >
                                <DiscordMarkdown mode={"DARK"} text="Below is a custom webhook message!" />
                            </DiscordMessage>

                            <DiscordMessage
                                mode={"DARK"}
                                user={{
                                    username: "NotificationBot",
                                    avatar: "/bot.webp",
                                    bot: true
                                }}
                            >
                                <DiscordMessageEmbed
                                    mode={"DARK"}
                                    color={0xFF0000}
                                >
                                    <DiscordMarkdown mode={"DARK"} text="custom message here!" />
                                </DiscordMessageEmbed>
                            </DiscordMessage>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <div className="mb-6 flex items-center justify-center size-12 rounded-xl bg-white/3 border border-white/8 shadow-inner relative overflow-hidden group">
                                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-transparent opacity-50" />

                                <BsSlashCircleFill className="size-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                            </div>

                            <h3 className={styles.h4}>Slash commands</h3>

                            <div className="pt-6">
                                For now we only have 6 slash commands, but we will add more soon!
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Button asChild>
                                    <Link
                                        href="/commands"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2"
                                    >
                                        <HiArrowRight className="w-5 h-5" />
                                        More Commands
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps("purge")}>
                                <DiscordMarkdown mode={"DARK"} text="Successfully deleted 9 messages!" />
                            </DiscordMessage>
                        </div>
                    </div>
                </div>
            </article>

            <section className="py-24 md:py-32 flex justify-center">
                <div className="max-w-4xl w-full flex flex-col items-center text-center px-6 space-y-10">
                    <div className="space-y-6">
                        <h2 className={cn(montserrat.className, "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white leading-[1.1]")}>
                            Ready to get started?
                        </h2>
                        <p className="text-[#949ba4] text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed font-medium opacity-80">
                            Join with communities already using NotificationBot to
                            streamline their server. Setup takes seconds, and
                            it&apos;s completely free.
                        </p>
                    </div>
                    <Button asChild size="lg">
                        <Link
                            href="/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                        >
                            <BsDiscord className="w-5 h-5" />
                            Get Started Now
                        </Link>
                    </Button>
                </div>
            </section>

            <div className="mb-24 w-full px-4">
                <Faq />
            </div>
        </div>
    );
}