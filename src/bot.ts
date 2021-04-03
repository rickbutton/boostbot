import { Client as DiscordClient } from "discord.js";
import { BUS, SYNC_COMPLETE_EVENT } from "./events";
import { getCharacters } from "./wow";

export async function startBot() {
    const client = new DiscordClient({
        partials: ["MESSAGE", "REACTION", "CHANNEL"]
    });
    
    await client.login(process.env.BOT_TOKEN);

    BUS.subscribe(SYNC_COMPLETE_EVENT, async e => {
        const user = await client.users.fetch(e.payload.id);

        const characters = await getCharacters(user.id);

        let message = `*Character Sync Complete!*\nThe following characters are synced:`;

        for (const character of characters) {
            message += `- ${character.name}-${character.realm}, Level ${character.level} ${character.race} ${character.class}`;
        }

        
        await user.send(message);
    });
}