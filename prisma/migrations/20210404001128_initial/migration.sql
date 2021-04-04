-- CreateTable
CREATE TABLE "Account" (
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSync" TIMESTAMP(3),
    "discordId" TEXT NOT NULL,
    "bnetId" TEXT,
    "bnetTag" TEXT,

    PRIMARY KEY ("discordId")
);

-- CreateTable
CREATE TABLE "Character" (
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "realm" TEXT NOT NULL,
    "faction" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "ioDps" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ioHealer" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ioTank" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discordId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boost" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session.sid_unique" ON "Session"("sid");

-- AddForeignKey
ALTER TABLE "Character" ADD FOREIGN KEY ("discordId") REFERENCES "Account"("discordId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boost" ADD FOREIGN KEY ("creatorId") REFERENCES "Account"("discordId") ON DELETE CASCADE ON UPDATE CASCADE;
