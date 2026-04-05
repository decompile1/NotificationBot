/* eslint-disable react-hooks/static-components */
"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowLeft, HiChat, HiExternalLink } from "react-icons/hi";

import { guildStore } from "@/common/guildStore";
import { userStore } from "@/common/userStore";
import Fetch from "@/components/buttonfetch";
import MessageCreatorEmbed from "@/components/discord/embedmaker";
import Switch from "@/components/input/api-switch";
import ImageUrlInput from "@/components/input/imageurlinput";
import NumberInput from "@/components/input/numinput";
import SelectMenu from "@/components/input/selectmenu";
import Notice from "@/components/notice";
import { Button } from "@/components/ui/button";
import type { ApiError, ApiV1GuildsModulesByeGetResponse } from "@/typings";
import { createSelectableItems } from "@/utils/selectableitems";

export default function Home() {
    const guild = guildStore((g) => g);
    const user = userStore((s) => s);

    const [error, setError] = useState<string>();
    const [bye, setBye] = useState<ApiV1GuildsModulesByeGetResponse>();

    const params = useParams();

    useEffect(() => {

        fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${params.guildId}/modules/bye`, {
            credentials: "include"
        })
            .then(async (res) => {
                const response = await res.json() as ApiV1GuildsModulesByeGetResponse;
                if (!response) return;

                switch (res.status) {
                    case 200: {
                        setBye(response);
                        break;
                    }
                    default: {
                        setBye(undefined);
                        setError((response as unknown as ApiError).message);
                        break;
                    }
                }

            })
            .catch(() => {
                setError("Error while fetching farewell data");
            });

    }, []);

    const Head = () => (
        <div className="flex justify-between relative bottom-2 mb-3">
            <Button asChild size="sm" variant="secondary">
                <Link href={`/dashboard/${guild?.id}/welcomer`} className="flex items-center gap-2">
                    <HiArrowLeft className="h-4 w-4" />
                    Back
                </Link>
            </Button>

            <Button asChild size="sm">
                <Link
                    href="/docs/welcomer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                >
                    Read docs
                    <HiExternalLink className="h-4 w-4" />
                </Link>
            </Button>
        </div>
    );

    if (bye === undefined) return (
        <div>
            <Head />
            {error && <Notice message={error} />}
        </div>
    );

    return (<>
        <Head />

        <Switch
            name="Farewell module enabled"
            url={`/guilds/${guild?.id}/modules/bye`}
            dataName="enabled"
            defaultState={bye?.enabled || false}
            disabled={false}
            onSave={(s) => {
                setBye({
                    ...bye,
                    enabled: s
                });
            }}
        />

        <NumberInput
            name="After how many seconds the message should be deleted"
            description="Set to 0 to disable."
            url={`/guilds/${guild?.id}/modules/bye`}
            dataName="delete_after"
            defaultState={bye?.delete_after ?? 0}
            disabled={!bye.enabled}
        />

        <div className="flex md:gap-4 gap-2">
            <SelectMenu
                name="Channel"
                url={`/guilds/${guild?.id}/modules/bye`}
                dataName="channelId"
                items={createSelectableItems(guild?.channels)}
                description="Select a channel where the goodbye message should be sent to"
                defaultState={bye?.channelId}
                disabled={!bye.enabled}
            />

            <Fetch
                className="w-1/3 md:w-1/6 relative top-8"
                url={`/guilds/${params.guildId}/modules/bye/test`}
                icon={<HiChat className="min-h-4 min-w-4" />}
                label="Test Message"
                method="POST"
                size="lg"
            />
        </div>

        <MessageCreatorEmbed
            name="Message"
            url={`/guilds/${guild?.id}/modules/bye`}
            dataName="message"
            defaultMessage={bye?.message}
            messageAttachmentComponent={bye.card.enabled &&
                <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_API}/welcome-card?type=welcome&username=${encodeURIComponent(user?.username as string)}&members=1000&hash=${encodeURIComponent(user?.avatarHash as string)}&id=${encodeURIComponent(user?.id as string)}${bye.card.background ? `&background=${encodeURIComponent(bye.card.background)}` : ""}`}
                    width={1024 / 2}
                    height={(256 + 16) / 2}
                    loading="lazy"
                    alt=""
                />
            }
            showMessageAttachmentComponentInEmbed={bye.card.inEmbed}
            disabled={!bye.enabled}
        >

            <div className={`mt-2 mb-4 border-2 dark:border-foreground border-foreground-100 rounded-xl p-6 ${!bye.card.enabled && "pb-[0px]"}`}>

                <Switch
                    name="Show image card"
                    url={`/guilds/${guild?.id}/modules/bye`}
                    dataName="card.enabled"
                    defaultState={bye.card.enabled}
                    disabled={!bye.enabled}
                    onSave={(s) => {
                        setBye({
                            ...bye,
                            card: {
                                ...bye.card,
                                enabled: s
                            }
                        });
                    }}
                />

                {bye.card.enabled && <>
                    <Switch
                        name="Set an image inside embed."
                        url={`/guilds/${guild?.id}/modules/bye`}
                        dataName="card.inEmbed"
                        defaultState={bye.card.inEmbed || false}
                        disabled={!bye.card.enabled || !bye.enabled}
                        onSave={(s) => {
                            setBye({
                                ...bye,
                                card: {
                                    ...bye.card,
                                    inEmbed: s
                                }
                            });
                        }}
                    />

                    <ImageUrlInput
                        name="Card Background"
                        url={`/guilds/${guild?.id}/modules/bye`}
                        ratio="aspect-[4/1]"
                        dataName="card.background"
                        description="Enter a url which should be the background for the image card. The recomended image ration is 4:1 and recommended resolution 1024x256px."
                        defaultState={bye.card.background || ""}
                        disabled={!bye.card.enabled || !bye.enabled}
                        onSave={(v) => {
                            setBye({
                                ...bye,
                                card: {
                                    ...bye.card,
                                    background: v
                                }
                            });
                        }}
                    />
                </>}
            </div>

        </MessageCreatorEmbed>
    </>);
}