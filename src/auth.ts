import { PrismaClient } from "@prisma/client";

export async function createAccountIfDoesntExist(discordId: string) {
    const prisma = new PrismaClient();

    const account = await prisma.account.findUnique({ where: { discordId } });
    if (!account) {
        const newAccount = {
            discordId,
        };
        await prisma.account.create({ data: newAccount });
    }
}

export async function updateBnetInformation(discordId: string, bnetId: string, bnetTag: string) {
    const prisma = new PrismaClient();
    await prisma.account.update({ where: { discordId }, data: { bnetId, bnetTag} });
}

export async function getAccount(discordId: string) {
    const prisma = new PrismaClient();

    return prisma.account.findUnique({ where: { discordId } });
}