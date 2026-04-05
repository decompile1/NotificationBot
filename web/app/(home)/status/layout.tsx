import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import type { ReactNode } from "react";

import { Anchor } from "@/components/ui/typography";
import { cn } from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

const montserrat = Montserrat({ subsets: ["latin"] });

interface Props {
    children: ReactNode;
}

export const generateMetadata = (): Metadata => {
    const title = "Status";
    const description = "Check the status of all clusters";
    const url = getCanonicalUrl("status");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            images: {
                url: `${getBaseUrl()}/bot.webp`,
                type: "image/webp"
            }
        },
        twitter: {
            card: "summary",
            title,
            description,
            images: {
                url: `${getBaseUrl()}/bot.webp`,
                alt: title
            }
        }
    };
};

export default function RootLayout({
    children
}: Props) {

    return (<>
        <h1
            className={cn(montserrat.className, "lg:text-5xl text-4xl font-bold dark:text-neutral-100 text-neutral-900 wrap-break-word mb-2 mt-15")}
        >
            <span className="bg-linear-to-r from-red-900 to-orange-400 bg-clip-text text-transparent h-20 break-keep">Notificationbot</span>
            {" status"}
        </h1>

        <div
            className="text-lg font-medium mb-6"
        >
            Please double check to see if all the displayed information is correct!
            You can also check the uptime of our services over at {""}
            <Anchor href="https://status.notificationbot.top">status.notificationbot.top</Anchor>
        </div>

        <div className="mb-12">
            {children}
        </div>
    </>);
}