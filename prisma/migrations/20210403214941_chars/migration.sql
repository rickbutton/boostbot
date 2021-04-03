-- CreateTable
CREATE TABLE "Character" (
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "realm" TEXT NOT NULL,
    "faction" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,

    PRIMARY KEY ("name", "realm"),
    FOREIGN KEY ("discordId") REFERENCES "Account" ("discordId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSync" DATETIME,
    "discordId" TEXT NOT NULL PRIMARY KEY,
    "bnetId" TEXT,
    "bnetTag" TEXT
);
INSERT INTO "new_Account" ("discordId", "bnetId", "bnetTag") SELECT "discordId", "bnetId", "bnetTag" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
