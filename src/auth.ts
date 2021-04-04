import { getDb } from "./db";

export async function createAccountIfDoesntExist(discordId: string) {
    const prisma = getDb();

    const account = await prisma.account.findUnique({ where: { discordId } });
    if (!account) {
        const newAccount = {
            discordId,
        };
        await prisma.account.create({ data: newAccount });
    }
}

export async function updateBnetInformation(discordId: string, bnetId: string, bnetTag: string) {
    const prisma = getDb();
    await prisma.account.update({ where: { discordId }, data: { bnetId, bnetTag} });
}

export async function getAccount(discordId: string) {
    const prisma = getDb();

    return prisma.account.findUnique({ where: { discordId } });
}