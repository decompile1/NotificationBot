"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import { BiMoon, BiSun } from "react-icons/bi";

import DiscordMessageEmbed from "@/components/discord/embed";
import { DiscordMarkdown } from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import ColorInput from "@/components/input/colorinput";
import Smartinput from "@/components/input/smart-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

export default function Home() {
    const params = useParams();
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [open] = useState<boolean>(true);
    const [mode, setMode] = useState<"DARK" | "LIGHT">("DARK");

    const [username, setUsername] = useState("");
    const [webhookurl, setWebhookurl] = useState("");
    const [webhookavatar, setWebhookavatar] = useState("");
    const [content, setContent] = useState("");
    const [embed, setEmbed] = useState<string>(JSON.stringify({}));
    const [embedfooter, setEmbedfooter] = useState<string>(JSON.stringify({}));

    const modeToggle = (
        <div
            className={cn(
                mode === "DARK" ? "bg-foreground-light" : "bg-foreground-100-light",
                "flex gap-1 text-neutral-400 rounded-md overflow-hidden"
            )}
        >
            <button
                onClick={() => setMode("DARK")}
                className={cn("py-2 px-3 rounded-md", mode === "DARK" ? "bg-foreground" : "hover:bg-foreground-100-alpha")}
            >
                <BiMoon className="h-5 w-5" />
            </button>
            <button
                onClick={() => setMode("LIGHT")}
                className={cn("py-2 px-3 rounded-md", mode === "LIGHT" ? "bg-foreground-100" : "hover:bg--alpha")}
            >
                <BiSun className="h-5 w-5" />
            </button>
        </div>
    );

    async function save() {
        setError(null);
        setState(State.Loading);

        const body = {
            content,
            embed: Object.assign(JSON.parse(embed), embedfooter.length ? { footer: JSON.parse(embedfooter) } : undefined),
            webhookAvatar: webhookavatar,
            webhookUrl: webhookurl,
            username: username
        };

        if (!body.embed.footer.text) body.embed.footer = { text: null };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/webhook`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then((r) => r.json())
            .catch(() => null);

        if (!res || "status" in res) {
            setState(State.Idle);
            setError("message" in res ? res.message : "Something went wrong while saving...");

            return;
        }

        setState(State.Success);
        setTimeout(() => setState(State.Idle), 1_000 * 8);
    }

    return (
        <>
            <div
                className={cn(
                    "mt-8 mb-4 border-2 dark:border-foreground border-foreground-100 rounded-xl md:px-4 md:pb-4 px-2 py-2",
                    error && "outline outline-red-500 outline-1"
                )}
            >
                <div className="text-lg py-2 dark:text-neutral-700 text-neutral-300 font-medium px-2">Discord Webhook</div>

                {open && (
                    <div className="md:m-1 relative">
                        <div className="lg:flex gap-1">
                            <div className="lg:w-3/6 m-1">
                                <Smartinput
                                    placeholder="Username"
                                    value={username}
                                    setValue={setUsername}
                                    max={20}
                                />
                                <Smartinput
                                    placeholder="Webhook URL"
                                    value={webhookurl}
                                    setValue={setWebhookurl}
                                    max={256}
                                />
                                <Smartinput
                                    placeholder="Webhook Avatar"
                                    value={webhookavatar}
                                    setValue={setWebhookavatar}
                                    max={256}
                                />
                                <Smartinput
                                    placeholder="Content"
                                    value={content}
                                    setValue={setContent}
                                    max={2000}
                                />
                                <Smartinput
                                    placeholder="Embed Title"
                                    value={embed}
                                    setValue={setEmbed}
                                    max={256}
                                    dataName="title"
                                />
                                <Smartinput
                                    placeholder="Embed Description"
                                    value={embed}
                                    setValue={setEmbed}
                                    max={4096}
                                    dataName="description"
                                />
                                <div className="flex gap-2">
                                    <ColorInput
                                        placeholder="Embed Color"
                                        value={embed}
                                        setValue={setEmbed}
                                        dataName="color"
                                    />
                                    <Smartinput
                                        placeholder="Embed Thumbnail"
                                        value={embed}
                                        setValue={setEmbed}
                                        max={256}
                                        dataName="thumbnail"
                                    />
                                </div>
                                <Smartinput
                                    placeholder="Embed Image"
                                    value={embed}
                                    setValue={setEmbed}
                                    max={256}
                                    dataName="image"
                                />
                                <div className="flex gap-2">
                                    <Smartinput
                                        placeholder="Embed Footer Icon"
                                        value={embedfooter}
                                        setValue={setEmbedfooter}
                                        max={256}
                                        dataName="icon_url"
                                    />
                                    <Smartinput
                                        placeholder="Embed Footer"
                                        value={embedfooter}
                                        setValue={setEmbedfooter}
                                        max={256}
                                        dataName="text"
                                    />
                                </div>

                                <Button
                                    className={cn("mt-1 w-full")}
                                    color="secondary"
                                    disabled={state === State.Loading}
                                    onClick={() => save()}
                                >
                                    Send Message
                                </Button>
                            </div>

                            <div className="md:hidden flex m-2 mt-4">
                                <div className="flex items-center w-full">
                                    <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">Color Theme</span>

                                    <div className="ml-auto flex items-center">{modeToggle}</div>
                                </div>
                            </div>

                            <div
                                className={cn(
                                    "relative lg:w-3/6 lg:mt-2 m-1 md:mt-8 mt-4 min-h-full rounded-md p-4 break-all overflow-hidden max-w-full text-neutral-200",
                                    mode === "DARK" ? "bg-discord-gray" : "bg-white"
                                )}
                            >
                                <div className="absolute z-10 top-2 right-2 hidden md:block">{modeToggle}</div>

                                <DiscordMessage
                                    mode={mode}
                                    user={{
                                        username: username || "NotificationBot",
                                        avatar: webhookavatar || "/notificationbot.png",
                                        bot: true
                                    }}
                                >
                                    <DiscordMarkdown mode={mode} text={content || ""} />

                                    <DiscordMessageEmbed
                                        mode={mode}
                                        title={JSON.parse(embed).title}
                                        color={JSON.parse(embed).color}
                                        thumbnail={JSON.parse(embed).thumbnail}
                                        image={JSON.parse(embed).image}
                                        footer={JSON.parse(embedfooter)}
                                    >
                                        {JSON.parse(embed).description && (
                                            <DiscordMarkdown mode={mode} text={JSON.parse(embed).description} />
                                        )}
                                    </DiscordMessageEmbed>
                                </DiscordMessage>
                            </div>
                        </div>
                        <div className="text-sm m-1 text-neutral-500">Preview UI might be a little bit off**</div>
                    </div>
                )}
            </div>

            <div className="flex relative bottom-3">
                <div className="ml-auto mb-2">
                    {error && <div className="ml-auto text-red-500 text-sm">{error}</div>}
                    {state === State.Success && <div className="ml-auto text-green-500 text-sm">Saved</div>}
                </div>
            </div>
        </>
    );
}