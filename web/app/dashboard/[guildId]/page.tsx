"use client";

import { HiBookOpen } from "react-icons/hi";

import { OverviewLink } from "@/components/overview-link";

import FollowUpdates from "./updates.component";

export default function Home() {

    return (
        <>
            <OverviewLink
                title="Documentation"
                message="Refer to the documentation any time!"
                url={"/docs/home"}
                icon={<HiBookOpen />}
            />

            <FollowUpdates />
        </>
    );
}