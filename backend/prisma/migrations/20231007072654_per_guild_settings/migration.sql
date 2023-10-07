/*
  Warnings:

  - You are about to drop the column `last_message_sent` on the `Stats` table. All the data in the column will be lost.
  - You are about to drop the column `last_online` on the `Stats` table. All the data in the column will be lost.
  - You are about to drop the column `message_count_bucket` on the `Stats` table. All the data in the column will be lost.
  - Added the required column `guildId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guildId` to the `Stats` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "RistrictedChannels" (
    "channelId" BIGINT NOT NULL PRIMARY KEY,
    "guildId" BIGINT NOT NULL,
    "requiredPoints" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "guildId" BIGINT NOT NULL PRIMARY KEY,
    "prefix" TEXT NOT NULL DEFAULT '!',
    "welcomeMessageFormat" TEXT NOT NULL DEFAULT 'Welcome {user}!',
    "openIntroChannelId" BIGINT NOT NULL,
    "IntroChannelId" BIGINT NOT NULL,
    "leaveMessageFormat" TEXT NOT NULL DEFAULT 'Goodbye {user}!',
    "leaveChannelId" BIGINT NOT NULL,
    "restrictedRoleId" BIGINT NOT NULL,
    "unlockRoleId" BIGINT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "messageId" BIGINT NOT NULL PRIMARY KEY,
    "userId" BIGINT NOT NULL,
    "channelId" BIGINT NOT NULL,
    "guildId" BIGINT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "statsUserId" BIGINT,
    CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Stats" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("channelId", "createdAt", "messageId", "statsUserId", "userId") SELECT "channelId", "createdAt", "messageId", "statsUserId", "userId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE UNIQUE INDEX "Message_messageId_key" ON "Message"("messageId");
CREATE TABLE "new_User" (
    "userId" BIGINT NOT NULL PRIMARY KEY,
    "guildId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Stats" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("name", "userId") SELECT "name", "userId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");
CREATE TABLE "new_Stats" (
    "userId" BIGINT NOT NULL PRIMARY KEY,
    "guildId" BIGINT NOT NULL,
    "lastMessageSent" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "lastOnline" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageCountBucket" INTEGER NOT NULL DEFAULT 30,
    "firstMessageId" BIGINT NOT NULL DEFAULT 0
);
INSERT INTO "new_Stats" ("userId") SELECT "userId" FROM "Stats";
DROP TABLE "Stats";
ALTER TABLE "new_Stats" RENAME TO "Stats";
CREATE UNIQUE INDEX "Stats_userId_key" ON "Stats"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "RistrictedChannels_channelId_key" ON "RistrictedChannels"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_guildId_key" ON "Settings"("guildId");
