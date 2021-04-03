import { wow } from "blizzard.js";
import { default as fetch } from "node-fetch";
import { PrismaClient, Character } from "@prisma/client";
import { BUS, SYNC_COMPLETE_EVENT } from "./events";

type UnsavedCharacter = Omit<Character, "created">;
interface RaiderIOScore {
    dps: number;
    healer: number;
    tank: number;
}
const DEFAULT_SCORE = {
    dps: 0,
    tank: 0,
    healer: 0,
};
async function getRaiderIOScore(name: string, realm: string, level: number): Promise<RaiderIOScore> {
    if (level < 60) {
        return DEFAULT_SCORE;
    }

    const url = `https://raider.io/api/v1/characters/profile?region=us&realm=${realm}&name=${name}&fields=mythic_plus_scores_by_season%3Acurrent`;
    const resp = await fetch(url);
    const json = await resp.text();

    const parsed = JSON.parse(json);
    const season = parsed?.mythic_plus_scores_by_season[0] ?? null;

    if (!season) {
        return DEFAULT_SCORE;
    } else {
        return {
            dps: season.scores.dps,
            healer: season.scores.healer,
            tank: season.scores.tank,
        };
    }
}

export async function syncCharacters(discordId: string, token: string) {
    const bnetClient = await wow.createInstance({
        key: String(process.env.BNET_CLIENT_ID),
        secret: String(process.env.BNET_CLIENT_SECRET),
        origin: "us",
        locale: "en_US",
    });

    const profile = await bnetClient.accountProfile({ token });

    const accounts = profile.data.wow_accounts ?? [];

    const newCharacters: UnsavedCharacter[] = [];
    for (const account of accounts) {
        const characters = account.characters ?? [];
        for (const character of characters) {
            const name = character.name;
            const realm = character.realm.name;
            const level = character.level;

            const io = await getRaiderIOScore(name, realm, level);

            newCharacters.push({
                discordId,
                id: String(character.id),
                name: character.name,
                realm: character.realm.name,
                faction: character.faction.name,
                class: character.playable_class.name,
                race: character.playable_race.name,
                level: character.level,
                ioDps: io.dps,
                ioHealer: io.healer,
                ioTank: io.tank,
            });
        }
    }

    const client = new PrismaClient();
    // find deleted characters
    const currentCharacters = await client.character.findMany({ where: { discordId } });
    const deletedCharacters = currentCharacters.filter(char => !newCharacters.some(newChar => char.id === newChar.id));

    await client.$transaction([
        ...deletedCharacters.map(deletedChar => client.character.delete({ where: { id: deletedChar.id }})),
        ...newCharacters.map(newCharacter =>
            client.character.upsert({ 
                where: { id: newCharacter.id },
                update: newCharacter,
                create: newCharacter,
            })),
        client.account.update({
            where: { discordId, },
            data: { lastSync: new Date() },
        }),
    ]);

    BUS.publish(SYNC_COMPLETE_EVENT({ id: discordId }));
}

export function getCharacters(discordId: string) {
    const client = new PrismaClient();
    return client.character.findMany({ where: { discordId } });
}