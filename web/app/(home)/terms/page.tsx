import { readFile } from "fs/promises";
import type { Metadata } from "next";

import CustomMarkdown from "@/components/markdown";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

export const revalidate = false;

export const generateMetadata = (): Metadata => {
    const title = "Terms of Service";
    const description = "Read about NotificationBot's Terms of Service.";
    const url = getCanonicalUrl("terms");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            type: "website",
            url,
            images: `${getBaseUrl()}/bot.webp`
        },
        twitter: {
            card: "summary",
            site: "notificationbot.top",
            title,
            description,
            images: `${getBaseUrl()}/bot.webp`
        }
    };
};

const PATH = `${process.cwd()}/public/legal/terms.md` as const;

export default async function Home() {
    const terms = await readFile(PATH, { encoding: "utf-8" });
    return <CustomMarkdown markdown={terms} />;
}