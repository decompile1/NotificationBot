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
    const [state, setState] = useState<State>(State.Loading);
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
            <div className="ml-auto flex items-center py-2 px-4">
                <Skeleton className="rounded-full mr-2 size-[30px]" />
                <Skeleton className="rounded-xl w-20 h-5" />
            </div>
        );
    }

    return <Dropdown user={user} />;
}

function Dropdown({ user }: { user: User; }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="ml-auto truncate flex hover:bg-background py-2 px-4 rounded-lg duration-200 items-center data-[state=open]:bg-background outline-none"
                >
                    <Avatar className="mr-2 border-2 border-blue-800 rounded-full w-7 h-7 sm:w-8 sm:h-8">
                        <AvatarImage
                            alt={user.username}
                            src={user.avatarHash ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatarHash}?size=96` : "/discord.webp"}
                        />
                    </Avatar>

                    <p className="mr-1 relative bottom-px truncate block text-primary-foreground font-medium tracking-tight text-xs sm:text-sm">{user.displayName || user.username}</p>
                    <HiChevronDown />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 scale-120 relative top-9 right-5' align="end">
                <DropdownMenuLabel className='flex items-center gap-3'>
                    <Avatar className="border-2 border-blue-800 rounded-full">
                        <AvatarImage
                            alt={user.username}
                            src={user.avatarHash ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatarHash}?size=96` : "/discord.webp"}
                        />
                    </Avatar>
                    <div className='flex flex-col pb-0.5 truncate'>
                        <span className='text-popover-foreground truncate'>{user.displayName || user.username}</span>
                        <span className='text-muted-foreground text-xs truncate'>{user.email}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/profile">
                            <HiIdentification />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/support">
                            <HiSupport />
                            Support
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/docs/index">
                            <HiBookOpen />
                            Documentation
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        asChild
                        className="text-red-400"
                    >
                        <button
                            className="w-full"
                            onClick={() => {
                                window.location.href = "/login?logout=true";
                            }}
                        >
                            < HiLogout />
                            Logout
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}