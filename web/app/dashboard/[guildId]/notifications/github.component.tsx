"use client";

import { useState } from "react";

import { guildStore } from "@/common/guildStore";
import Modal from "@/components/input/modal";
import SelectMenu from "@/components/input/selectmenu";
import Smartinput from "@/components/input/smart-input";
import { type ApiV1GuildsModulesNotificationsGetResponse, NotificationType } from "@/typings";
import { createSelectableItems } from "@/utils/selectableitems";

// Regex patterns for GitHub repositories
const URL_REPO_REGEX = /^https?:\/\/(www\.)?github\.com\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_.-]+)\/?$/;
const REPO_HANDLE = /^([A-Za-z0-9_-]+)\/([A-Za-z0-9_.-]+)$/;

function validateAccount(input: string) {
    // Check if it's a full GitHub URL
    const urlMatch = URL_REPO_REGEX.exec(input);
    if (urlMatch) {
        return `${urlMatch[2]}/${urlMatch[3]}`;
    }

    // Check if it's in owner/repo format
    const handleMatch = REPO_HANDLE.exec(input);
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

export function GitHubNotificationModal({
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
                title="Create new notification"
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={() => {
                    const validated = validateAccount(name);
                    if (!validated && name.startsWith("https://")) return new Error("Invalid GitHub repository URL");
                    if (!validated) return new Error("Invalid repository format. Use: owner/repo");

                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            type: NotificationType.GitHub,
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
                    name="Repository"
                    placeholder="facebook/react"
                    value={name}
                    setValue={setName}
                />

                <SelectMenu
                    name="Channel"
                    dataName="channelId"
                    items={createSelectableItems(channels)}
                    description="Select a channel where notifications should be sent into."
                    onSave={(o) => {
                        setChannelId(o.value as string);
                    }}
                />

                <div className="mt-4">
                    <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">
                        How to get a repository&apos;s name
                    </span>
                    <br />
                    The repository name is in the format <code className="break-all">owner/repo</code>. For example:{" "}
                    <code>facebook/react</code> or <code>vercel/next.js</code>.
                    <br />
                    <br />
                    You can also paste the full GitHub URL like{" "}
                    <code className="break-all">https://github.com/facebook/react</code> and it will be automatically converted.
                </div>
            </Modal>
        </>
    );
}