/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";

import DumbTextInput from "@/components/input/smart-input";
import {
    Accordion,
    AccordionContent,
    AccordionItem
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { intl } from "@/utils/intl";

import type { ApiCluster } from "./api";

export function Side({
    status
}: {
    status: ApiCluster[];
}) {
    const [guildId, setGuildId] = useState<string>("");

    const clusterId = useMemo(
        () => /^\d{15,20}$/.test(guildId) ?
            getClusterId(guildId || "", status.length)
            : null,
        [guildId]
    );

    useEffect(() => {
        const element = document.getElementById("cluster-" + clusterId);
        if (!element) return;

        element.classList.add("outline");
        return () => element.classList.remove("outline");
    }, [clusterId]);

    return (
        <div className="flex flex-col gap-5">
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
            >
                <AccordionItem value="item-1">
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        <Row name="Uptime">
                            {status[0].uptime}
                        </Row>
                        <Row name="Latency avg">
                            {~~(status.reduce((prev, cur) => prev + cur.ping, 0) / status.length)}ms
                        </Row>
                        <Row name="Memory">
                            {intl.format(~~(status.reduce((prev, cur) => prev + cur.memory, 0)))}mb
                        </Row>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div>
                <DumbTextInput
                    name="Find your Server's Cluster"
                    placeholder="Copy & Paste your Server Id"
                    value={guildId}
                    setValue={setGuildId}
                    description={/^\d{15,20}$/.test(guildId) ? `Your guild is on cluster #${clusterId}.` : ""}
                />
                Sharding is the process of breaking a Discord bot into smaller processes so that it has a better time handling events
            </div>
        </div>
    );
}

function Row({ name, children }: { name: string; children: ReactNode; }) {
    return (
        <div className="flex items-center justify-between">
            {name}
            <Button>
                {children}
            </Button>
        </div>
    );
}

function getClusterId(guildId: string, totalShards: number) {
    return Number((BigInt(guildId) >> BigInt(22))) % totalShards;
}