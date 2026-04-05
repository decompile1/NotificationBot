"use client";
import { HiUserAdd, HiUserRemove } from "react-icons/hi";

import { guildStore } from "@/common/guildStore";
import { OverviewLink } from "@/components/overview-link";

export default function Home() {
    const guild = guildStore((g) => g);

    return (
        <div>

            <div className="w-full md:flex gap-3">
                <OverviewLink
                    className="md:w-2/3"
                    title="Welcome Message"
                    message="Welcome announcement for joining users"
                    url={`/dashboard/${guild?.id}/welcomer/welcome`}
                    icon={<HiUserAdd />}
                />
            </div>

            <OverviewLink
                title="Goodbye Message"
                message="Goodbye message for leaving users"
                url={`/dashboard/${guild?.id}/welcomer/goodbye`}
                icon={<HiUserRemove />}
            />

        </div >
    );
}