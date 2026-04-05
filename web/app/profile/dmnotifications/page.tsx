/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

import { type User, userStore } from "@/common/userStore";
import Switch from "@/components/input/api-switch";
import ImageUrlInput from "@/components/input/imageurlinput";
import TextInput from "@/components/input/textinput";
import { deepMerge } from "@/utils/merge";

export default function Home() {
    const user = userStore((s) => s);
    const [enabled, setEnabled] = useState<boolean>(false);

    useEffect(() => {
        if (user?.extended?.dmnotifications?.enabled !== undefined) {
            setEnabled(user.extended.dmnotifications.enabled);
        }
    }, [user?.extended?.dmnotifications?.enabled]);

    if (user?.id && !user.extended) return <></>;

    return (
        <>
            <Switch
                name="Enable DM Notifications"
                url="/dashboard/@me/dmnotifications"
                dataName="enabled"
                defaultState={user?.extended?.dmnotifications?.enabled ?? false}
                disabled={false}
                onSave={(s) => {
                    setEnabled(s);
                    userStore.setState(
                        deepMerge<User>(user, {
                            extended: {
                                dmnotifications: {
                                    enabled: s
                                }
                            }
                        })
                    );
                }}
            />

            <div className="lg:flex gap-3">
                <div className="lg:w-1/2">
                    <TextInput
                        name="Embed Color"
                        url="/dashboard/@me/dmnotifications"
                        dataName="embedcolor"
                        description="Color of your notification embed"
                        type="color"
                        defaultState={user?.extended?.dmnotifications?.embedcolor ?? 0}
                        disabled={!enabled}
                        onSave={(value) => {
                            userStore.setState(
                                deepMerge<User>(user, {
                                    extended: {
                                        dmnotifications: {
                                            embedcolor: Number(value)
                                        }
                                    }
                                })
                            );
                        }}
                    />
                </div>
                <div className="w-1/2">
                    <TextInput
                        name="Source"
                        url="/dashboard/@me/dmnotifications"
                        dataName="source"
                        description="Where your notification is coming from"
                        type="text"
                        defaultState={user?.extended?.dmnotifications?.source || ""}
                        disabled={!enabled}
                        onSave={(value) => {
                            const rsslinkregex = /^(https?:\/\/[^\s]+(?:(?:\.rss|\.xml|\/rss|\/feed)(?:\/.*)?))$/i;
                            if (!rsslinkregex.test(String(value).trim())) {
                                alert("Please enter a valid RSS feed URL (e.g., ends in .rss, .xml, /rss, or /feed)");
                                return;
                            }
                            userStore.setState(
                                deepMerge<User>(user, {
                                    extended: {
                                        dmnotifications: {
                                            source: String(value)
                                        }
                                    }
                                })
                            );
                        }}
                    />
                </div>
            </div>
            <div className="w-1/2">
                <TextInput
                    name="Message"
                    url="/dashboard/@me/dmnotifications"
                    dataName="text"
                    description="Custom message"
                    type="text"
                    defaultState={user?.extended?.dmnotifications?.text || ""}
                    disabled={!enabled}
                    onSave={(value) => {
                        userStore.setState(
                            deepMerge<User>(user, {
                                extended: {
                                    dmnotifications: {
                                        text: String(value)
                                    }
                                }
                            })
                        );
                    }}
                />

                <ImageUrlInput
                    name="Thumbnail"
                    url="/dashboard/@me/dmnotifications"
                    ratio="aspect-[4/1]"
                    dataName="thumbnail"
                    description="Enter the url for your thumbnail. The recomended image ration is 4:1 and recommended resolution 1024x256px."
                    defaultState={user?.extended?.dmnotifications?.thumbnail || ""}
                    disabled={!enabled}
                    onSave={(value) => {
                        userStore.setState(
                            deepMerge<User>(user, {
                                extended: {
                                    dmnotifications: {
                                        thumbnail: String(value)
                                    }
                                }
                            })
                        );
                    }}
                />
            </div>
        </>
    );
}