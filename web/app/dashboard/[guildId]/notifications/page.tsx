"use client";

import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { type ReactNode, useMemo } from "react";
import { HiChat, HiViewGridAdd } from "react-icons/hi";

import { guildStore } from "@/common/guildStore";
import Fetch from "@/components/buttonfetch";
import { ClientBadge } from "@/components/client-ui";
import { useList } from "@/components/data/lists/hook";
import { Navigation } from "@/components/data/lists/navigation";
import { ItemSelector } from "@/components/data/lists/selector";
import { CreateSplash } from "@/components/data/lists/splash";
import MessageCreatorEmbed from "@/components/discord/embedmaker";
import MultiSelectMenu from "@/components/input/multiselectmenu";
import SelectMenu from "@/components/input/selectmenu";
import TextInput from "@/components/input/textinput";
import { ScreenMessage } from "@/components/screen-message";
import { Button } from "@/components/ui/button";
import { cacheOptions } from "@/lib/api";
import { type ApiV1GuildsModulesNotificationsGetResponse, NotificationFlags, NotificationType } from "@/typings";
import { BitfieldManager, bitfieldToArray } from "@/utils/bitfields";
import { createSelectableItems } from "@/utils/selectableitems";
import { getCanonicalUrl } from "@/utils/urls";

import { hasBlueskyPost } from "./api";
import { DeleteNotification } from "./delete.component";
import { CreateNotificationSelect, Icon, Style } from "./select.component";

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    const url = `/guilds/${params.guildId}/modules/notifications` as const;
    const { item, items, setItemId, editItem, addItem, removeItem, isLoading, error } =
        useList<ApiV1GuildsModulesNotificationsGetResponse>({ url });

    const flags = useMemo(() => new BitfieldManager(item?.flags || 0), [item?.flags]);

    if (error) {
        return (
            <ScreenMessage
                top="20vh"
                title="Something went wrong on this page.."
                description={error}
                href={`/dashboard/${guild?.id}`}
                button="Go back to overview"
                icon={<HiViewGridAdd />}
            ></ScreenMessage>
        );
    }

    if (isLoading || !items) return <></>;

    if (!item) {
        return (
            <ItemSelector<ApiV1GuildsModulesNotificationsGetResponse>
                items={items}
                set={setItemId}
                sort={(a, b) => a.creator.username.localeCompare(b.creator.username)}
                name={(item) => item.creator.username}
                docs="/notifications"
                createButton={(options) => <CreateNotificationSelect style={options.style} add={addItem} set={setItemId} />}
                deleteButton={(options) => <DeleteNotification id={options.id} name={options.name} remove={removeItem} />}
                item={(item) => {
                    const channel = guild?.channels?.find((channel) => channel.id === item.channelId);

                    return (
                        <>
                            <ClientBadge
                                className="aspect-square bg-[#1c1b1f]"
                                size="sm"
                            >
                                <Icon type={item.type} className="size-4 mt-0.5" />
                                {item.creator.avatarUrl ? (
                                    <Image
                                        alt={`${item.creator.username}'s avatar`}
                                        className="rounded-full"
                                        src={item.creator.avatarUrl}
                                        width={46}
                                        height={46}
                                    />
                                ) : (
                                    <div className="size-[46px] flex items-center justify-center bg-foreground rounded-full select-none font-medium text-lg text-neutral-200">
                                        {item.creator.username.slice(0, 2)}
                                    </div>
                                )}
                            </ClientBadge>

                            <div className="flex flex-col items-start">
                                <span className="flex gap-2 text-neutral-100 text-lg font-medium -mb-[0.5]">
                                    {item.creator.username}
                                </span>

                                <div className="bg-blurple/50 text-neutral-100 px-1 rounded-md">#{channel?.name || "unknown"}</div>
                            </div>
                        </>
                    );
                }}
            >
                <CreateSplash name="notifications" description="Click Create New Notification to get started">
                    <CreateNotificationSelect style={Style.Big} add={addItem} set={setItemId} />
                </CreateSplash>
            </ItemSelector>
        );
    }

    return (
        <>
            <Navigation
                href="/notifications"
                docs="/notifications"
                avatar={
                    item.creator.avatarUrl ? (
                        <Image
                            alt={`${item.creator.username}'s avatar`}
                            className="rounded-full"
                            src={item.creator.avatarUrl}
                            width={24}
                            height={24}
                        />
                    ) : (
                        <div className="size-[24px] flex items-center justify-center bg-foreground rounded-full select-none font-medium text-sm text-neutral-200">
                            {item.creator.username.slice(0, 2)}
                        </div>
                    )
                }
                name={item.creator.username}
                icon={<Icon type={item.type} className="text-white size-3" />}
            />

            <div className="flex md:gap-4 gap-2">
                <SelectMenu
                    name="Channel"
                    url={url + "/" + item.id}
                    dataName="channelId"
                    items={createSelectableItems(guild?.channels)}
                    description="Select a channel where notifications should be send into."
                    defaultState={item.channelId}
                    onSave={(o) => editItem("channelId", o.value as string)}
                />

                <TestButton type={item.type} creatorId={item.creatorId}>
                    <Fetch
                        className="w-1/3 md:w-1/6 relative top-8"
                        url={url + "/" + item.id + "/test"}
                        icon={<HiChat className="min-h-4 min-w-4" />}
                        label="Test Message"
                        method="POST"
                        size="lg"
                    />
                </TestButton>
            </div>

            <div className="flex md:gap-4 gap-2">
                <SelectMenu
                    className="md:w-1/2 w-full"
                    name="Ping role"
                    url={url + "/" + item.id}
                    dataName="roleId"
                    items={[
                        { name: "@everyone (everyone in server)", value: "everyone" },
                        { name: "@here (everyone online)", value: "here" },
                        ...createSelectableItems(guild?.roles)
                    ]}
                    description="Select a role which should get pinged on uploads."
                    defaultState={item.roleId}
                    onSave={(o) => editItem("roleId", o.value as string)}
                    showClear
                />

                {item.type === NotificationType.Bluesky ? (
                    <MultiSelectMenu
                        className="md:w-1/2 w-full"
                        name="Filter"
                        url={url + "/" + item.id}
                        dataName="flags"
                        items={bitfieldToArray(NotificationFlags)}
                        description="Select the types of posts to send in addition to regular posts."
                        defaultState={flags.toArray()}
                        onSave={(o) => {
                            const flags = o.map((flag) => Number(flag.value));
                            editItem(
                                "flags",
                                flags.reduce((a, b) => a | b, 0)
                            );
                        }}
                    />
                ) : (
                    <TextInput
                        className="md:w-1/2 w-full"
                        name="Ignore regex"
                        url={url + "/" + item.id}
                        dataName="regex"
                        description="Posts that match the provided regex will be ignored."
                        defaultState={item.regex || ""}
                    />
                )}
            </div>

            {item.type === NotificationType.Bluesky && (
                <TextInput
                    className="md:w-1/2 w-full"
                    name="Ignore regex"
                    url={url + "/" + item.id}
                    dataName="regex"
                    description="Posts that match the provided regex will be ignored."
                    defaultState={item.regex || ""}
                />
            )}

            <MessageCreatorEmbed
                key={item.id}
                name="Message"
                url={url + "/" + item.id}
                dataName="message"
                defaultMessage={item.message}
                onSave={(value) => editItem("message", { content: value.content ?? null, embed: value.embed })}
            />
        </>
    );
}

function TestButton({ type, creatorId, children }: { type: NotificationType; creatorId: string; children: ReactNode; }) {
    const { data, isLoading } = useQuery({
        queryKey: [type, creatorId],
        queryFn: () => hasBlueskyPost(creatorId),
        enabled: type === NotificationType.Bluesky,
        ...cacheOptions
    });

    if (type === NotificationType.Bluesky && (data === false || isLoading)) {
        return (
            <Button
                className="w-1/3 md:w-1/6 relative top-8 flex"
                onClick={() => {
                    window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(`hm ${getCanonicalUrl("bluesky")}`)}`);
                }}
                size="lg"
                variant="flat"
                disabled={isLoading}
            >
                {isLoading ? <LoaderCircleIcon className="animate-spin" /> : <HiChat className="min-h-4 min-w-4" />}
                Test Message
            </Button>
        );
    }

    if (type === NotificationType.Reddit) {
        return (
            <Button
                className="w-1/3 md:w-1/6 relative top-8 flex"
                onClick={() => {
                    window.open(
                        `https://reddit.com/r/${creatorId}/submit?title=${encodeURIComponent("Test Reddit to Discord Notifications")}&url=${encodeURIComponent(getCanonicalUrl("docs", "notifications"))}`
                    );
                }}
                size="lg"
                variant="flat"
            >
                <HiChat className="min-h-4 min-w-4" />
                Test Message
            </Button>
        );
    }

    return children;
}