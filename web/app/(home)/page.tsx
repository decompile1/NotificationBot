import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiLightningBolt, HiPlus } from "react-icons/hi";
import { HiArrowRight, HiChartBar, HiCheck, HiCollection, HiDocument, HiDocumentText, HiPresentationChartBar, HiSpeakerphone, HiTrash } from "react-icons/hi";
import { HiArrowNarrowRight } from "react-icons/hi";

import DiscordMessageEmbed from "@/components/discord/embed";
import { DiscordMarkdown } from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import { AvatarGroup, UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Box from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import ScrollToTopButton from "@/components/ui/scroll-top";
import { Scrollwheel } from "@/components/ui/scrollwheel";
import { Code } from "@/components/ui/typography";
import { defaultFetchOptions } from "@/lib/api";
import thumbnail from "@/public/assets/thumbnail.png";
import type { ApiV1TopguildsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";
import { toFixedArrayLength } from "@/utils/fixed-array";
import { montserrat } from "@/utils/font";

import { Faq } from "./faq.component";
import IntegrationsMarquee from "./integrations.component";
import MessageAnimation from "./messageanimation.component";
import Reviews from "./reviews.component";

const styles = {
    h2: cn(montserrat.className, "lg:text-5xl text-4xl bg-gradient-to-b bg-clip-text text-transparent from-red-900 from-40% to-red-500 font-bold mb-4"),
    h3: cn(montserrat.className, "lg:text-2xl text-xl bg-gradient-to-b bg-clip-text text-transparent from-red-900 from-40% to-red-500 font-semibold")
};

const messageProps = (command?: string) => ({
    mode: "DARK" as const,
    commandUsed: command
        ? {
            name: command,
            username: "@explosiveapple1",
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

const evenMoreContent = [
    {
        icon: HiDocument,
        title: "/Vote",
        text: "Voting helps promote our Discord bot on top.gg!"
    },
    {
        icon: HiTrash,
        title: "Purge",
        text: "Use /purge to delete old notifications from the bot"
    },
    {
        icon: HiCollection,
        title: "Logging system",
        text: "This will be coming out soon"
    },
    {
        icon: HiPresentationChartBar,
        title: "Support and bugs",
        text: "If you encounter any bugs, use /support and we will fix the bug immediately, so that you can have the best experience!"
    },
    {
        icon: HiDocumentText,
        title: "Webhooks",
        text: "Send webhooks right from the dashboard"
    },
    {
        icon: HiSpeakerphone,
        title: "Announcements",
        text: "/announce to send notifications if you prefer sending them on discord"
    }
];

export default async function Home() {
    const data: ApiV1TopguildsGetResponse | null = await fetch(
        `${process.env.NEXT_PUBLIC_API}/top-guilds`,
        defaultFetchOptions
    )
        .then((res) => res.json())
        .catch(() => null);

    return (
        <div className="flex flex-col items-center w-full">

            <div className="flex w-full items-center gap-8 mb-8 md:mb-10 min-h-[500px] h-[calc(100svh-14rem)] md:h-[calc(100dvh-16rem)]">
                <div className="md:min-w-96 w-full md:w-2/3 xl:w-1/2 flex flex-col space-y-6">

                    <h1 className={cn(montserrat.className, "lg:text-7xl md:text-6xl text-5xl font-semibold text-neutral-900 dark:text-neutral-100")}>
                        <span className="bg-linear-to-r from-red-900 to-red-600 bg-clip-text text-transparent">
                            Next Generation
                        </span>{" "}
                        of{" "}
                        <span className="inline-flex items-center">
                            Discord Notifications
                        </span>
                    </h1>

                    <span className="text-lg font-medium max-w-152 mb-4">
                        We introduce you to fully customizable notifications from your favorite platforms,
                        a full-on welcoming system, and slash commands!
                    </span>

                    <div className="space-y-4">
                        <Link href="/dashboard" className="flex items-center text-zinc-600 hover:underline">
                            Go to Dashboard <HiArrowNarrowRight className="ml-1" />
                        </Link>

                        <div className="flex flex-wrap gap-2">
                            <Button asChild>
                                <Link
                                    href="https://discord.com/oauth2/authorize?client_id=1366507117044957276"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <HiPlus className="w-5 h-5" />
                                    Invite NotificationBot
                                </Link>
                            </Button>

                            <Button asChild>
                                <Link
                                    href="/support"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <BsDiscord className="w-5 h-5" />
                                    Support Server
                                </Link>
                            </Button>
                        </div>

                        {/* <span className={cn("lg:ml-auto flex gap-2 text-neutral-500 font-medium opacity-80 pl-20 lg:pr-20 rotate-2 scale-110 relative pt-0.5", handwritten.className)}>
                            <Image
                                src={ArrowPic}
                                width={24}
                                height={24}
                                alt="arrow up"
                                className="h-5 w-5"
                                draggable={false}
                            />
                            Add NotificationBot to get started!
                        </span> */}
                    </div>
                    {data && data.guilds && data.guilds.length > 0 && (
                        <div className="mr-auto flex flex-col items-start gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-neutral-400 dark:text-neutral-300">
                                    Used by many servers:
                                </span>
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
                                    and <strong>{data.guildCount.toLocaleString()}</strong> others
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                {/* Desktop: right side */}
                <div className="ml-auto w-fit xl:w-1/2 hidden md:block">
                    <div className="flex gap-4 justify-end xl:relative xl:left-14 w-full xl:w-fit">
                        <MessageAnimation />
                    </div>
                </div>
            </div>
            {/* Mobile: below hero text */}
            <div className="block md:hidden w-full">
                <div className="flex justify-center">
                    <MessageAnimation />
                </div>
            </div>

            <Scrollwheel />

            <article
                itemScope
                itemType="http://schema.org/Article"
                className="flex flex-col gap-28 my-10"
            >
                <div>
                    <h2 className={styles.h2}>Customizable Notifications 🔊</h2>
                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2 flex flex-col items-start">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCheck />
                                Supports up to 3 platforms
                            </Badge>

                            <h3 className={styles.h3}>Enjoy notifications from your favorite platforms</h3>

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

                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Notifications in your DMs 📥</h2>
                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2 flex flex-col items-start">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCheck />
                                Supports RSS
                            </Badge>

                            <h3 className={styles.h3}>Notifications sent right into your DMs</h3>

                            <div className="pt-6">
                                For this to work, just make sure <Code>direct messages</Code> is turned on!

                                <ol className="mt-4">
                                    {[
                                        "One configuration only for now"
                                    ].map((name) => (
                                        <li key={name} className="flex gap-1 items-center">
                                            <HiCheck className="text-red-400" />
                                            {name}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div className="flex gap-2 mt-5">
                                <Button asChild>
                                    <Link
                                        href="/profile/dmnotifications"
                                        target="_blank"
                                    >
                                        <HiArrowRight />
                                        Setup
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage
                                mode={"DARK"}
                                user={{
                                    username: "explosiveapple1",
                                    avatar: "/user.webp",
                                    bot: false
                                }}
                            >
                                <DiscordMarkdown mode={"DARK"} text="Demo below!" />
                            </DiscordMessage>

                            <DiscordMessage {...messageProps()}>
                                <DiscordMarkdown
                                    mode="DARK"
                                    text={"Hey **@explosiveapple1**, you have a new notifications"}
                                />
                                <DiscordMessageEmbed
                                    mode="DARK"
                                    title="new notification from nyt"
                                    color={0xFF0000}
                                >
                                    https://rss.nytimes.com/services/xml/rss/nyt/World.xml
                                </DiscordMessageEmbed>

                            </DiscordMessage>

                            <span className="text-sm mt-1 opacity-75">
                                Example message
                            </span>

                        </div>

                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Top-notch greeting system 👋</h2>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCheck />
                                includes custom backgrounds
                            </Badge>

                            <h3 className={styles.h3}>Automatically greet new members</h3>

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
                                <DiscordMarkdown mode={"DARK"} text="Welcome **@explosiveapple1** to **a very special server** 👋" />
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
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Create webhook messages 🤖</h2>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCheck />
                                Supports embeds for free
                            </Badge>

                            <h3 className={styles.h3}>Easily send webhooks</h3>

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
                                    username: "explosiveapple1",
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
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Useful Slash Commands⚡</h2>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">

                            <h3 className={styles.h3}>We offer slash commands as well</h3>

                            <div className="pt-6">
                                For now we only have 6 slash commands, we will add more soon!
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
                    </Box>
                </div>
            </article>

            <div className="text-center">
                <h2 className="text-xl font-bold">
                    <span className="text-red-900">Integrations </span>
                    with your favorite{" "}
                    <span className="text-red-500">platforms</span>
                </h2>

                <p className="mt-4 text-sm sm:text-md text-gray-400">
                    Never worry about sending manually sending out new notifications from your favorite platforms ever again!
                </p>
            </div>

            <div className="w-full overflow-hidden">
                <IntegrationsMarquee />
            </div>

            <div className="max-w-7xl mx-auto px-20">
                <div className="relative flex justify-center items-center mt-32">
                    {evenMoreContent.map(({ icon: Icon }, index) => {
                        const rotation = 180 / (evenMoreContent.length - 1) * index;
                        return (
                            <div
                                key={index}
                                className="absolute"
                                style={{
                                    transform: `rotate(-${rotation}deg) translateX(120px) rotate(${rotation}deg)`
                                }}
                            >
                                <div className="flex justify-center items-center bg-red-700 rounded-full h-16 w-16">
                                    <Icon className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mb-20 mt-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-red-900 to-red-500">
                        Countless more Features
                    </h2>
                    <p className="mt-4 text-sm sm:text-md text-gray-400">
                        We offer more than just notifications
                    </p>
                </div>

                <div className="grid w-full max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 px-4">
                    {evenMoreContent.map(({ icon: Icon, title, text }) => (
                        <Card key={title} className="text-center relative">
                            <span className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                <Icon className="h-8 w-8" />
                            </span>
                            <CardHeader className="mt-16">
                                <CardTitle>{title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{text}</p>
                            </CardContent>
                        </Card>
                    ))}

                    {/* ✅ Centered Button */}
                    <div className="flex justify-center items-center mx-auto relative overflow-hidden rounded-lg border border-border group p-px h-fit col-span-1 sm:col-span-2 lg:col-span-3">
                        <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite_reverse] bg-[conic-gradient(from_90deg_at_0%_50%,#ef4444_50%,hsl(var(--input)/30)_7%)]" />
                        <Button
                            asChild
                            className="px-2 backdrop-blur-xs backdrop-brightness-50 md:backdrop-brightness-25 bg-none rounded-[6px]"
                        >
                            <Link prefetch={false} href="/commands">
                                <HiLightningBolt />
                                More Commands
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mb-24 w-full px-4">
                <Reviews />
            </div>

            <div className="mb-24 w-full px-4">
                <Faq />
            </div>
        </div>
    );
}