"use client";

import { useState } from "react";
import { HiTrash } from "react-icons/hi";

import { guildStore } from "@/common/guildStore";
import Modal from "@/components/input/modal";
import { Button } from "@/components/ui/button";
import {
    Tooltip
} from "@/components/ui/tooltip";

interface Props {
    id: string | null;
    name: string;

    remove: (id: string) => void;
}

export function DeleteNotification({
    id,
    name,

    remove
}: Props) {
    const guildId = guildStore((g) => g?.id);
    const [open, setOpen] = useState(false);

    return (
        <>
            <Tooltip>
                {/* <TooltipTrigger>Delete Notification</TooltipTrigger> */}
                <Button onClick={() => setOpen(true)} disabled={!id}>
                    <span>
                        <HiTrash />
                    </span>
                    <span className="sr-only">Delete selected notification</span>
                </Button>
            </Tooltip>

            <Modal
                buttonName="Delete"
                variant="destructive"
                title={"Delete Notification: " + name}
                isOpen={open}
                onClose={() => setOpen(false)}
                onSubmit={() => {
                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications/${id}`, {
                        method: "DELETE",
                        credentials: "include"
                    });
                }}
                onSuccess={() => {
                    if (id) remove(id);
                }}
            >
                Are you sure you want to delete {"\""}
                {name}
                {"\""} ({id})?
            </Modal>
        </>
    );
}