import { Hono } from "hono";

import config from "@/src/config";

const router = new Hono();

interface Command {
    id: string;
    name: string;
    description: string;
}

router.get("/", async (c) => {
    try {
        const res = await fetch(`${config.discordEndpoint}/applications/${config.client.clientId}/commands`, {
            headers: {
                Authorization: `Bot ${config.client.token}`
            }
        });

        const commands = await res.json();
        const filtered = (commands as Command[]).map((cmd: Command) => ({
            id: cmd.id,
            name: cmd.name,
            description: cmd.description
        }));

        return c.json(filtered);

    } catch (error) {
        console.error("Error processing command data:", error);
    }
});

export default router;