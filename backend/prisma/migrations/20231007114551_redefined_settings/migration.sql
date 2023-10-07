/*
  Warnings:

  - You are about to drop the column `restrictedRoleId` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `unlockRoleId` on the `Settings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "guildId" BIGINT NOT NULL PRIMARY KEY,
    "prefix" TEXT NOT NULL DEFAULT '!',
    "welcomeMessageFormat" TEXT NOT NULL DEFAULT 'Welcome {user}!',
    "openIntroChannelId" BIGINT NOT NULL DEFAULT 0,
    "introChannelId" BIGINT NOT NULL DEFAULT 0,
    "leaveMessageFormat" TEXT NOT NULL DEFAULT 'Goodbye {user}!',
    "leaveChannelId" BIGINT NOT NULL DEFAULT 0,
    "unverifiedMemberRoleId" BIGINT NOT NULL DEFAULT 0,
    "verifiedMemberRoleId" BIGINT NOT NULL DEFAULT 0
);
INSERT INTO "new_Settings" ("guildId", "introChannelId", "leaveChannelId", "leaveMessageFormat", "openIntroChannelId", "prefix", "welcomeMessageFormat") SELECT "guildId", "introChannelId", "leaveChannelId", "leaveMessageFormat", "openIntroChannelId", "prefix", "welcomeMessageFormat" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_guildId_key" ON "Settings"("guildId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
