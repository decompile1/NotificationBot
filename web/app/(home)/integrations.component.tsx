"use client";

import React from "react";
import { BsChat, BsReddit, BsTwitch, BsYoutube } from "react-icons/bs";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Marquee,
    MarqueeContent,
    MarqueeItem
} from "@/components/ui/marquee";
import { Code } from "@/components/ui/typography";

const integrationsData = [
    {
        name: "YouTube",
        icon: BsYoutube,
        content:
      "With placeholders like `video.title`, `video.uploaded.ago`, and `creator.subs`, NotificationBot will notify your server whenever a YouTube creator uploads."
    },
    {
        name: "Twitch",
        icon: BsTwitch,
        content:
      "We use `stream.title`, `stream.game`, and even `stream.live.since` to make stream notifications that feel personal and timely."
    },
    {
        name: "Reddit",
        icon: BsReddit,
        content:
      "The bot pulls `post.title`, `post.flair`, and `author.username` so cleanly that our Reddit integration feels native."
    },
    {
        name: "Bluesky",
        icon: BsChat,
        content:
      "`post.text`, `post.type`, and `creator.handle` let us deliver Bluesky posts right to Discord."
    }
];

export default function IntegrationsMarquee() {
    const renderTextWithCode = (text: string) => {
        const parts = text.split(/(`[^`]+`)/g);
        return parts.map((part, i) =>
            part.startsWith("`") && part.endsWith("`") ? (
                <Code key={i} className="text-lg font-semibold text-foreground/90">
                    {part.slice(1, -1)}
                </Code>
            ) : (
                <span key={i} className="text-lg leading-relaxed">
                    {part}
                </span>
            )
        );
    };

    return (
        <section className="relative w-full my-24 overflow-hidden">
            <Marquee className="relative py-6">
                <MarqueeContent speed={40} pauseOnHover autoFill>
                    {integrationsData.map((integration, i) => (
                        <MarqueeItem key={i} className="mx-10">
                            <Card className="w-md h-60 shrink-0 border-border backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
                                <CardHeader className="flex flex-row items-center gap-6 mb-4">
                                    <integration.icon className="w-14 h-14 text-red-500" />
                                    <CardTitle className="text-2xl font-semibold">
                                        {integration.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-400 text-lg leading-relaxed space-y-2">
                                    {renderTextWithCode(integration.content)}
                                </CardContent>
                            </Card>
                        </MarqueeItem>
                    ))}
                </MarqueeContent>
            </Marquee>
        </section>
    );
}