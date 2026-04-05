import type { ApplicationCommand, ChatInputApplicationCommandData, Client } from "discord.js";

import areCommandsDifferent from "@/src/utils/areCommandsDifferent";
import getApplicationCommands from "@/src/utils/getApplicationCommands";
import getLocalCommands from "@/src/utils/getLocalCommands";

export default async (client: Client) => {
    try {
        const localCommands = await getLocalCommands();
        const applicationCommands = await getApplicationCommands(
            client,
            null
            // process.env.testServer
        );

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find((cmd: ApplicationCommand) => cmd.name === name);
            const existingData = existingCommand?.toJSON() as ChatInputApplicationCommandData;

            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`🗑 Deleted command "${name}".`);
                    continue;
                }

                if (areCommandsDifferent(
                    { description: existingData.description, options: existingData.options ?? [] },
                    { description: localCommand.description, options: localCommand.options ?? [] }
                )) {

                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options
                    });

                    console.log(`🔁 Edited command "${name}".`);
                }
            } else {
                if (localCommand.deleted) {
                    console.log(`⏩ Skipping registering command "${name}" as it's set to delete.`);
                    continue;
                }
                console.log(`Registering command "${name}" with options:`, options);

                await applicationCommands.create({
                    name,
                    description,
                    options
                });

                console.log(`👍 Registered command "${name}."`);
            }
        }
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
};