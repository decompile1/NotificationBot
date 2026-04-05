"use client";

import { useState } from "react";
import { HiMail } from "react-icons/hi";

import { guildStore } from "@/common/guildStore";
import Modal from "@/components/input/modal";
import SelectMenu from "@/components/input/selectmenu";
import { createSelectableItems } from "@/utils/selectableitems";

export default function FollowUpdates() {
    const guild = guildStore((g) => g);

    const [open, setOpen] = useState(false);
    const [channelId, setChannelId] = useState<string>();

    return (
        <>
            <div>
                <div className="text-sm mb-0.5">Posting updates {guild?.follownewsChannel?.name && "into"}</div>

                {guild?.follownewsChannel?.name && (
                    <div className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium">
                        #{guild?.follownewsChannel?.name}
                    </div>
                )}

                <button
                    className="flex dark:text-red-400/60 dark:hover:text-red-400/90 text-red-600/60 hover:text-red-600/90 duration-200"
                    onClick={() => setOpen(true)}
                >
                    <HiMail className="relative top-1" />
                    <span className="ml-2">
                        {guild?.follownewsChannel?.name ? "Change " : "Set "}
                        channel
                    </span>
                </button>
            </div>

            <Modal
                title="NotificationBot updates"
                className="!overflow-visible"
                isOpen={open && !!guild}
                onClose={() => setOpen(false)}
                onSubmit={() => {
                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild?.id}/follow-updates`, {
                        method: "PATCH",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            channelId
                        })
                    });
                }}
                onSuccess={() => {
                    guildStore.setState((g) => {
                        if (!g) return g;

                        g.follownewsChannel = {
                            name: g!.channels!.find((c) => c.id === channelId)!.name,
                            channelId: channelId!
                        };

                        return g;
                    });
                }}
            >
                <SelectMenu
                    name="Channel"
                    dataName="channelId"
                    items={createSelectableItems(guild?.channels, ["ViewChannel", "ManageWebhooks"])}
                    description="Select a channel for the notificationbot updates to be sent to"
                    defaultState={guild?.follownewsChannel?.channelId}
                    onSave={(o) => {
                        setChannelId(o.value as string);
                    }}
                />
            </Modal>
        </>
    );
}