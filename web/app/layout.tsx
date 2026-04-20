import "./globals.css";

import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { CookiesProvider } from "next-client-cookies/server";

import Notice, { NoticeType } from "@/components/notice";
import { LoginButton } from "@/components/ui/login-button";
import { ProfileHeader } from "@/components/ui/nav-header";
import { cn } from "@/utils/cn";
import { notosans, outfit } from "@/utils/font";
import { getBaseUrl } from "@/utils/urls";

import { Provider } from "./provider";

export const viewport: Viewport = {
    themeColor: "#5e0202",
    initialScale: 0.85
};

export const generateMetadata = (): Metadata => {
    const title = "NotificationBot - Next Generation of Notifications";
    const description =
        "Setup notifications from your favorite platforms in a haste without slash commands!";

    return {
        metadataBase: new URL(getBaseUrl()),

        manifest: "/manifest.json",
        appleWebApp: {
            capable: true,
            title: "NotificationBot",
            startupImage: "/bot.webp",
            statusBarStyle: "black-translucent"
        },

        title: {
            default: title,
            template: "%s"
        },

        description,
        keywords: ["discord", "bot"],

        alternates: {
            canonical: getBaseUrl()
        },

        openGraph: {
            title: {
                default: title,
                template: "NotificationBot Dashboard | %s"
            },
            description,
            type: "website",
            url: getBaseUrl(),
            images: `${getBaseUrl()}/bot.webp`
        },
        twitter: {
            card: "summary",
            site: "notificationbot.top",
            title,
            description,
            images: `${getBaseUrl()}/bot.webp`
        },

        other: {
            google: "notranslate"
        },

        creator: "Decompile1",
        publisher: "Decompile1",

        robots: "index, follow"
    };
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <CookiesProvider>
            <html
                suppressHydrationWarning
                data-theme="dark"
                lang="en"
                className="dark dark:text-white text-white flex justify-center max-w-screen overflow-x-hidden"
            >
                <link rel="icon" href="/icons/favicon.ico" sizes="any" />
                <body
                    className={cn(
                        "w-full max-w-7xl overflow-x-hidden xl:overflow-visible!",
                        outfit.variable,
                        notosans.variable
                    )}
                    style={{ overflow: "visible" }}
                >
                    <div id="bg" className="absolute top-0 right-0 w-screen h-screen -z-50" />
                    <NoScript />
                    <NavBar />
                    <Provider>
                        {children}
                    </Provider>
                </body>
            </html>
        </CookiesProvider>
    );
}

function NoScript() {
    return (
        <noscript className="p-4 pb-0 flex">
            <Notice
                className="mb-0"
                message="This site needs JavaScript to work - Please either enable JavaScript or update to a supported Browser."
                type={NoticeType.Info}
            />
        </noscript>
    );
}

async function NavBar({ className }: { className?: string; }) {
    const jar = await cookies();
    interface Linktypes {
        name: string;
        hash: string;
    }

    const links: Linktypes[] = [
        { name: "Status", hash: "/status" },
        { name: "Invite", hash: "/add" },
        { name: "Documentation", hash: "/docs/home" }
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-1/2 -translate-x-1/2 z-999",
                "flex items-center",
                "w-[95%] sm:w-[92%] lg:w-[85%]",
                "h-16 sm:h-20 mt-6",
                "px-6 md:px-10",
                "rounded-3xl",

                "bg-black/30",
                "backdrop-blur-2xl",
                "backdrop-saturate-150",
                "border border-white/10",

                "shadow-[0_12px_40px_0_rgba(0,0,0,0.4)]",

                className
            )}
        >
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <Image
                        src="/bot.webp"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="w-10 h-10 md:w-12 md:h-12"
                    />
                    <span className="hidden xs:inline text-lg md:text-xl font-bold tracking-tight">
                        tickets
                    </span>
                </Link>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-4 md:gap-8">
                <ul className="flex items-center gap-1 sm:gap-2 mx-auto">
                    {links.map((link) => (
                        <Link
                            key={link.hash}
                            className={cn(
                                "px-4 py-2 rounded-xl transition-all duration-200",
                                "text-sm md:text-base font-medium text-neutral-300",
                                "hover:bg-white/10 hover:text-white",
                                link.name === "Premium" && "hidden sm:inline-flex"
                            )}
                            href={link.hash}
                        >
                            {link.name}
                        </Link>
                    ))}
                </ul>

                <div className="flex items-center border-l border-white/10 pl-4 md:pl-8">
                    {jar.get("sessiontoken")?.value
                        ? <ProfileHeader/>
                        : <LoginButton className="text-sm sm:text-base" />
                    }
                </div>
            </div>
        </nav>
    );
}