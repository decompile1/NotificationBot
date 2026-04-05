import type { Metadata } from "next";
import { BsDiscord, BsGithub } from "react-icons/bs";

import { filterDuplicates } from "@/utils/filterduplicates";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";

import { members, repos } from "./constants";
import { Repository } from "./gitrepo.component";
import { DiscordServer } from "./guild.component";
import { Person } from "./user.component";

export const revalidate = 3600;

export const generateMetadata = (): Metadata => {
    const title = "Team";
    const description = "Thanks to these people for contributing";
    const url = getCanonicalUrl("team");

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

export default function Home() {
    return (
        <div>
            <h2 className="text-2xl font-medium text-neutral-200">Team 💡</h2>
            <div className="max-w-xl mt-1 mb-2">
                Some information about the people contributing to the NotificationBot project
            </div>

            <div className="relative mb-10">
                {filterDuplicates(members.map((member) => member.team)).map((team) => (
                    <div
                        key={team}
                        className="py-3"
                    >
                        <h3 className="text-lg font-medium text-neutral-200">
                            {team.split("-").map((str) => str.replace(/^\w/, (char) => char.toUpperCase())).join(" ")}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-3">
                            {members
                                .filter((member) => member.team === team)
                                .map((member) => (
                                    <Person
                                        key={member.id}
                                        id={member.id}
                                        social={"social" in member ? member.social as string : undefined}
                                    />
                                ))
                            }
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-medium text-neutral-200">Open Source <BsGithub className="inline ml-1 mb-1" /></h2>
            <div className="max-w-xl mt-1">
                Everything is open source. We accept pull requests, contributions, and advice.
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 py-5 mb-10">
                {repos.map((repo) => (
                    <Repository
                        key={repo}
                        fullname={repo}
                    />
                ))}
            </div>

            <h2 className="text-2xl font-medium text-neutral-200">Discord Community <BsDiscord className="inline ml-1 mb-1 text-[#5865f2]" /></h2>
            <div className="max-w-xl mt-1">
                Join our Discord server
            </div>

            <div className="mt-2 py-5 md:w-1/2">
                <DiscordServer guildId="1332096827872514058" />
            </div>

        </div>
    );
}