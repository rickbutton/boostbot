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
    "ioDps" INTEGER NOT NULL DEFAULT 0,
    "ioHealer" INTEGER NOT NULL DEFAULT 0,
    "ioTank" INTEGER NOT NULL DEFAULT 0,
    "discordId" TEXT NOT NULL,
    FOREIGN KEY ("discordId") REFERENCES "Account" ("discordId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("created", "id", "name", "realm", "faction", "class", "race", "level", "discordId") SELECT "created", "id", "name", "realm", "faction", "class", "race", "level", "discordId" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
