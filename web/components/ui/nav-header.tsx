"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiBookOpen, HiChevronDown, HiIdentification, HiLogout, HiSupport } from "react-icons/hi";

import type { User } from "@/common/userStore";
import { userStore } from "@/common/userStore";
import { webStore } from "@/common/webStore";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown";
import { LoginButton } from "@/components/ui/login-button";
import { Skeleton } from "@/components/ui/skeleton";
import { authorize } from "@/utils/authorizeuser";

enum State {
    Idle = 0,
    Loading = 1,
    Failure = 2
}

export function ProfileHeader() {
    const [state, setState] = useState(State.Loading);
    const user = userStore((s) => s);

    useEffect(() => {
        authorize({ setState })
            .then((_user) => {
                userStore.setState({
                    ...(_user || {}),
                    __fetched: true
                });
            });

        webStore.setState({
            width: window?.innerWidth
        });
    }, []);

    if (state === State.Failure) {
        return <LoginButton state={state} className="ml-auto" />;
    }

    if (state === State.Loading || !user) {
        return (
            <div className="ml-auto flex items-center gap-2 py-2 px-3">
                <Skeleton className="rounded-full size-8" />
                <Skeleton className="rounded-lg w-20 h-4" />
            </div>
        );
    }

    return <Dropdown user={user} />;
}

function Dropdown({ user }: { user: User; }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="ml-auto flex items-center gap-2 py-1.5 px-3 rounded-xl border border-transparent hover:border-border hover:bg-card duration-150 outline-none data-[state=open]:border-border data-[state=open]:bg-card">
                    <Avatar className="size-7 rounded-full ring-2 ring-red-800">
                        <AvatarImage
                            alt={user.username}
                            src={user.avatarHash ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatarHash}?size=96` : "/discord.webp"}
                        />
                    </Avatar>
                    <span className="text-sm font-medium text-neutral-200 truncate max-w-28">
                        {user.displayName || user.username}
                    </span>
                    <HiChevronDown className="text-muted-foreground size-4" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 mt-2" align="end">
                <DropdownMenuLabel className="flex items-center gap-3 p-3">
                    <Avatar className="size-9 rounded-full ring-2 ring-red-800">
                        <AvatarImage
                            alt={user.username}
                            src={user.avatarHash ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatarHash}?size=96` : "/discord.webp"}
                        />
                    </Avatar>
                    <div className="flex flex-col truncate">
                        <span className="text-sm font-medium text-popover-foreground truncate">
                            {user.displayName || user.username}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <HiIdentification className="size-4" />
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/support" className="flex items-center gap-2">
                            <HiSupport className="size-4" />
                            Support
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/docs/index" className="flex items-center gap-2">
                            <HiBookOpen className="size-4" />
                            Documentation
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="text-red-400 focus:text-red-400">
                        <button
                            className="w-full flex items-center gap-2"
                            onClick={() => {
                                window.location.href = "/login?logout=true";
                            }}
                        >
                            <HiLogout className="size-4" />
                            Logout
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}