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

        const validCharacters = characters.filter(c =>
            c.level === 60 &&
            (c.ioDps > 0 || c.ioHealer > 0 || c.ioTank > 0));

        let message = `**Character Sync Complete!**\n\nThe following characters are valid boosters:\n`;

        for (const character of validCharacters) {
            message += `\n - ${character.name}-${character.realm}, Level ${
                    character.level} ${character.race} ${character.class}`;
            message += `\n   - DPS IO: ${character.ioDps}`;
            message += `\n   - Healer IO: ${character.ioHealer}`;
            message += `\n   - Tank IO: ${character.ioTank}`;
        }

        
        await user.send(message);
    });
}