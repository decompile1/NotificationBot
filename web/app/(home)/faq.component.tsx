"use client";

import { isValidElement } from "react";
import { HiBell, HiCash, HiChat, HiUserAdd } from "react-icons/hi";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Section } from "@/components/ui/section";
import { Anchor, Code, Ol } from "@/components/ui/typography";

const data = [
    {
        startContent: <HiUserAdd />,
        title: "How do I invite NotificationBot to my Server?",
        subtitle: "Invite NotificationBot to your server to get started!",
        content: (
            <Ol itemProp="text">
                <li>
                    Be sure to have the <Code>Manage Server</Code> permission on the server you want to{" "}
                    <Anchor href="/add">invite NotificationBot</Anchor> into.
                </li>
                <li>
                    Open Discord{"'"}s add-app flow at <Anchor href="/add">/add</Anchor>.
                </li>
                <li>
                    Select a server and click on {"\""}Continue{"\""}.
                </li>
                <li>
                    <span className="font-semibold">DO NOT UNCHECK</span> any permissions and click
                    on {"\""}Authorize{"\""}.
                </li>
                <li>
                    <span className="font-semibold">Done!</span> You should now find yourself on the Dashboard for your server!
                </li>
            </Ol>
        )
    },
    {
        startContent: <HiCash />,
        title: "Is the notification system free to use?",
        content: (
            <div>
                It is free for now but I might add some paid features in the future!
                We would appreciate it if you give <Anchor href="/vote">NotificationBot a vote on top.gg</Anchor>
            </div>
        )
    },
    {
        startContent: <HiChat />,
        title: "How do I set up the Notifications system?",
        content: (
            <div itemProp="text">
                <ol className="list-decimal list-inside marker:text-neutral-500 mb-4">
                    <li>
                        <Anchor href="/add">Invite NotificationBot</Anchor> to your server
                    </li>
                    <li>
                        Go to the <Anchor href="/profile">Dashboard</Anchor>, find your server and click {"\""}manage{"\""}.
                    </li>
                    <li>
                        Go to the tab that says {"\""}Third Party Notifications{"\""}
                    </li>
                    <li>
                        <span className="font-semibold">Fill in the placeholders and you it will start notifying you🎉</span>
                    </li>
                </ol>
                You can also watch the video tutorial below or{" "}
                <Anchor href="https://youtu.be/DtWhSFajVlw">watch it on YouTube</Anchor>.
                <iframe
                    className="mt-2 aspect-video rounded-lg"
                    width="100%"
                    src="https://www.youtube.com/embed/DtWhSFajVlw"
                    title="NotificationBot Ranking system"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
            </div>
        )
    },
    {
        startContent: <HiBell />,
        title: "Where can I view the uptime of NotificationBot's services?",
        content: <div itemProp="text">Head over to{" "} <Anchor href="https://status.notificationbot.top">status.notificationbot.top</Anchor> </div>
    }
];

const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.map((item) => ({
        "@type": "Question",
        name: item.title,
        acceptedAnswer: {
            "@type": "Answer",
            text: extractText(item.content)
        }
    }))
};

export function Faq({
    showTitle = false
}: {
    showTitle?: boolean;
}) {
    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schema)
                }}
            />
            {showTitle ? (
                <Section className="mb-4" title="Frequently Asked Questions about NotificationBot">
                    These questions are commonly asked
                </Section>
            ) : (
                <b className="sr-only">Frequently Asked Questions for NotificationBot</b>
            )}

            <Accordion type="single" collapsible className="w-full" defaultValue={data[0].title}>
                {data.map((item) => (
                    <AccordionItem key={item.title} value={item.title}>
                        <AccordionTrigger>{item.title}</AccordionTrigger>
                        <AccordionContent className="text-sm leading-relaxed">
                            {item.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

function extractText(content: React.ReactNode): string {
    if (typeof content === "string") return content;
    if (typeof content === "number") return content.toString();

    if (isValidElement(content)) {
        if ((content.props as React.PropsWithChildren).children) {
            return extractText((content.props as React.PropsWithChildren).children);
        }
    }
    if (!Array.isArray(content)) return "";

    return content
        .map((child) => extractText(child))
        .join(" ");
}