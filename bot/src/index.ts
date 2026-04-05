import { Client, IntentsBitField, ShardingManager } from "discord.js";
import path from "path";

import eventHandler from "@/src/handlers/eventHandler";

import config from "./config";

const isManager = process.argv.includes("--manager");

if (isManager) {
    // manager process
    const manager = new ShardingManager(path.resolve(__dirname, "index.js"), {
        token: config.client.token,
        totalShards: "auto"
    });

    manager.on("shardCreate", (shard) => {
        console.log(`Launched shard ${shard.id}`);
    });

    manager.spawn();

} else {
    const client = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.GuildPresences,
            IntentsBitField.Flags.MessageContent
        ]
    });

    (() => {
        try {
            eventHandler(client);
            client.login(config.client.token);
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    })();
}