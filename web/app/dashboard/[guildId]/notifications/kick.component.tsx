"use client";

import { useState } from "react";

import { guildStore } from "@/common/guildStore";
import Modal from "@/components/input/modal";
import SelectMenu from "@/components/input/selectmenu";
import Smartinput from "@/components/input/smart-input";
import { type ApiV1GuildsModulesNotificationsGetResponse, NotificationType } from "@/typings";
import { createSelectableItems } from "@/utils/selectableitems";

// Regex patterns for Kick channels
const URL_KICK_REGEX = /^https?:\/\/(www\.)?kick\.com\/([A-Za-z0-9_]+)\/?$/;
const KICK_HANDLE = /^[A-Za-z0-9_]+$/;

function validateKickAccount(input: string) {
    // Check if it's a full Kick URL
    const urlMatch = URL_KICK_REGEX.exec(input);
    if (urlMatch) {
        return urlMatch[2];
    }

    // Check if it's just the channel handle
    const handleMatch = KICK_HANDLE.exec(input);
    if (handleMatch) {
        return input;
    }

    return null;
}

interface Props {
    add: (notification: ApiV1GuildsModulesNotificationsGetResponse) => void;
    set: (id: string) => void;

    isOpen: boolean;
    onClose: () => void;
}

export function KickNotificationModal({
    add,
    set,
    isOpen,
    onClose
}: Props) {
    const guildId = guildStore((g) => g?.id);
    const channels = guildStore((g) => g?.channels);

    const [name, setName] = useState("");
    const [channelId, setChannelId] = useState<string | null>(null);

    return (
        <>
            <Modal<ApiV1GuildsModulesNotificationsGetResponse>
                title="Create new Kick notification"
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={() => {
                    const validated = validateKickAccount(name);
                    if (!validated && name.startsWith("https://")) return new Error("Invalid Kick channel URL");
                    if (!validated) return new Error("Invalid Kick username format. Use: username or https://kick.com/username");

                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            type: NotificationType.Kick,
                            channelId,
                            creatorHandle: validated
                        })
                    });
                }}
                onSuccess={(tag) => {
                    add(tag);
                    set(tag.id);

                    setName("");
                    setChannelId(null);
                }}
            >
                <Smartinput
                    name="Kick Channel"
                    placeholder="trainwreckstv"
                    value={name}
                    setValue={setName}
                />

                <SelectMenu
                    name="Channel"
                    dataName="channelId"
                    items={createSelectableItems(channels)}
                    description="Select a Discord channel where Kick notifications should be sent."
                    onSave={(o) => {
                        setChannelId(o.value as string);
                    }}
                />

                <div className="mt-4">
                    <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">
                        How to get a Kick channel name
                    </span>
                    <br />
                    The channel name is simply the streamer&apos;s handle on Kick. For example:{" "}
                    <code>trainwreckstv</code> or <code>adinross</code>.
                    <br />
                    <br />
                    You can also paste the full Kick URL like{" "}
                    <code className="break-all">https://kick.com/trainwreckstv</code> and it will be automatically converted.
                </div>
            </Modal>
        </>
    );
}