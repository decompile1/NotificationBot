import Image from "next/image";
import Link from "next/link";
import type { HTMLProps } from "react";
import { BiCopyright, BiLogoGithub, BiLogoGmail } from "react-icons/bi";
import { BsDiscord } from "react-icons/bs";
import { HiBookOpen, HiCloud, HiCube, HiHand, HiLibrary, HiUserAdd } from "react-icons/hi";

import TopggIcon from "@/components/icons/topgg";
import { getUser } from "@/lib/discord/user";
import { cn } from "@/utils/cn";

import { Badge } from "./ui/badge";

export async function Footer(props: HTMLProps<HTMLDivElement>) {
    const dev = await getUser("920487197046607872");
    const date = new Date("April 15, 2025");
    const timestamp = date.getTime();

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className={cn("text-primary/75 w-full mt-10 text-left", props.className)} {...props}>
                <div className="flex items-center gap-1 font-semibold">
                    <BsDiscord className="relative top-[1px] text-red-700" />
                    <span className="text-xl bg-gradient-to-r from-red-900 to-red-400 bg-clip-text text-transparent">
                        NotificationBot
                    </span>
                    <span className="text-xl bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">for</span>
                    <span className="text-xl bg-gradient-to-r from-amber-400 to-orange-700 bg-clip-text text-transparent">
                        Discord
                    </span>
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-2 justify-between">
                    <div>
                        <div className="mb-3 dark:text-neutral-400 text-neutral-600">
                            <span className="flex gap-1 items-center">
                                <BiCopyright />
                                <span>
                                    <Link href="/" className="hover:underline">
                                        NotificationBot {new Date(timestamp).getFullYear()} - {new Date().getFullYear()}
                                    </Link>
                                </span>
                            </span>

                            <span className="flex gap-1 items-center">
                                <HiCube />
                                <span className="flex items-center">
                                    <span>Made by
                                        <Link href="/team">
                                            <Badge
                                                className="relative top-[3px] ml-0.5"
                                                radius="rounded"
                                            >
                                                <Image
                                                    src={dev?.avatarUrl as string}
                                                    alt="avatar"
                                                    width={18}
                                                    height={18}
                                                    className="rounded-full relative right-1.5 px-[1px]"
                                                />
                                                {dev?.username}
                                            </Badge>
                                        </Link>
                                    </span>
                                </span>
                            </span>
                        </div>

                        <FooterSocials />
                    </div>

                    <FooterLinks />
                </div>
            </div>
        </div>
    );
}

function FooterSocials() {
    return (
        <div className="ml-auto svg-max flex flex-wrap items-center gap-2 mt-2 md:mt-0">
            <Link
                href="https://github.com/decompile1"
                className="text-white/75 hover:text-white duration-200 size-6"
                aria-label="Decompile1 GitHub"
            >
                <BiLogoGithub />
            </Link>
            <Link
                href="mailto:example.com"
                className="text-white/75 hover:text-white duration-200 size-6"
                aria-label="via email"
            >
                <BiLogoGmail />
            </Link>
            <Link href="/vote" className="text-[#ff3366] duration-200 size-6" aria-label="Vote for NotificationBot on top.gg">
                <TopggIcon />
            </Link>
        </div>
    );
}

function FooterLinks() {
    return (
        <div className="flex gap-12 dark:text-neutral-400 text-neutral-600 select-none">
            <div>
                <div className="font-medium dark:text-neutral-200 text-neutral-800 mb-1">Legal</div>
                <Link className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2" href="/terms">
                    <HiLibrary />
                    Terms of Service
                </Link>
                <Link className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2" href="/privacy">
                    <HiHand />
                    Privacy Policy
                </Link>
            </div>
            <div>
                <div className="font-medium dark:text-neutral-200 text-neutral-800 mb-1">Links</div>
                <Link className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2" href="/support">
                    <BsDiscord />
                    Support
                </Link>
                <Link className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2" href="/docs/home">
                    <HiBookOpen />
                    Documentation
                </Link>
                <Link className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2" href="/status">
                    <HiCloud />
                    Status
                </Link>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/invite"
                    prefetch={false}
                >
                    <HiUserAdd />
                    Invite
                </Link>
            </div>
        </div>
    );
}