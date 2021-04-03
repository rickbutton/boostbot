/*
  Warnings:

  - You are about to alter the column `ioDps` on the `Character` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `ioHealer` on the `Character` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `ioTank` on the `Character` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "realm" TEXT NOT NULL,
    "faction" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "ioDps" REAL NOT NULL DEFAULT 0,
    "ioHealer" REAL NOT NULL DEFAULT 0,
    "ioTank" REAL NOT NULL DEFAULT 0,
    "discordId" TEXT NOT NULL,
    FOREIGN KEY ("discordId") REFERENCES "Account" ("discordId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("created", "id", "name", "realm", "faction", "class", "race", "level", "ioDps", "ioHealer", "ioTank", "discordId") SELECT "created", "id", "name", "realm", "faction", "class", "race", "level", "ioDps", "ioHealer", "ioTank", "discordId" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
