import { HiFire, HiInformationCircle } from "react-icons/hi";

import { Badge } from "@/components/ui/badge";
import Box from "@/components/ui/box";
import { defaultFetchOptions } from "@/lib/api";

interface Commands {
    name: string;
    description: string;
    id: string;
}

export default async function Home() {
    const commands = await fetch(`${process.env.NEXT_PUBLIC_API}/commands`, defaultFetchOptions)
        .then((res) => res.json())
        .catch(() => null) as Commands[] | null;

    return (
        <Box
            none
            className="p-5 pb-3 dark:bg-foreground bg-foreground-100 rounded-lg my-4 w-full mt-15"
        >
            <div className="flex">
                <Badge
                    variant="flat"
                    radius="rounded"
                >
                    <HiFire />
                    List of Slash Commands
                </Badge>

                <div className="ml-auto flex items-center gap-1 opacity-80">
                    <span className="text-xs">Since May 2025</span>
                    <HiInformationCircle />
                </div>
            </div>

            {commands && Array.isArray(commands) && commands.length ?
                <div className="divide-y divide-foreground">
                    {commands
                        .sort((a, b) => b.name.localeCompare(a.name))
                        .slice(0, 6)
                        .map((command) => (
                            <div
                                key={command.name}
                                className="text-base py-4 flex flex-col md:flex-row gap-4 md:items-center"
                            >
                                <div className="-mb-2 md:mb-0 flex items-center h-min">
                                    <span className="dark:text-neutral-100 text-neutral-900 text-xl font-semibold md:font-medium">/{command.name}</span>
                                    <span className="ml-auto italic text-sm md:hidden opacity-80">{(command.name)}</span>
                                </div>
                                <span>{command.description}</span>
                                <span className="ml-auto italic text-sm hidden md:block">{(command.name)}</span>
                            </div>
                        ))
                    }
                </div>
                :
                <div className="flex flex-col items-center my-10">
                    <div className="text-3xl dark:text-neutral-100 text-neutral-900 font-semibold mb-4">Something went wrong...</div>
                    <div className="text-md dark:text-neutral-400 text-neutral-600 font-semibold">The commands list could not be loaded at this time</div>
                </div>
            }

        </Box>
    );
}