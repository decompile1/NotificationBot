import type { Client } from "discord.js";
import path from "path";

import getAllFiles from "@/src/utils/getAllFiles";

export default (client: Client) => {
    const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort();

        const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

        if (!eventName) {
            console.error(`Event name could not be determined for folder: ${eventFolder}`);
            continue;
        }

        client.on(eventName, async (arg) => {
            for (const eventFile of eventFiles) {
                try {
                    const { default: eventFunction } = await import(eventFile);

                    if (typeof eventFunction !== "function") {
                        console.error(`Error: ${eventFile} does not export a function.`);
                        continue;
                    }

                    await eventFunction(client, arg);
                } catch (error) {
                    console.error(`Error importing or running event handler from ${eventFile}:`, error);
                }
            }
        });
    }
};