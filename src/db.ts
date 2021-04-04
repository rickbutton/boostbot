import { PrismaClient } from "@prisma/client";

let client: PrismaClient;
export function getDb() {
    if (!client) {
        client = new PrismaClient();
    }
    return client;
}