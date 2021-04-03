import { Client as DiscordClient } from "discord.js";
import { BUS, SYNC_COMPLETE_EVENT } from "./events";

export async function startBot() {
    const client = new DiscordClient({
        partials: ["MESSAGE", "REACTION", "CHANNEL"]
    });
    
    await client.login(process.env.BOT_TOKEN);

    BUS.subscribe(SYNC_COMPLETE_EVENT, async e => {
        const user = await client.users.fetch(e.payload.id);

        const message = `Character Sync Complete!`;
        await user.send(message);
    });
}