/*
  Warnings:

  - The primary key for the `Character` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `Character` table without a default value. This is not possible if the table is not empty.

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
    "level" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    FOREIGN KEY ("discordId") REFERENCES "Account" ("discordId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("created", "name", "realm", "faction", "class", "race", "level", "discordId") SELECT "created", "name", "realm", "faction", "class", "race", "level", "discordId" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
