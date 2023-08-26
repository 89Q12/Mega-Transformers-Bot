/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `message_points` on the `Stats` table. All the data in the column will be lost.
  - Added the required column `channelId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "userId" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    CONSTRAINT "User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Stats" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("name", "userId") SELECT "name", "userId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");
CREATE TABLE "new_Message" (
    "messageId" BIGINT NOT NULL PRIMARY KEY,
    "userId" BIGINT NOT NULL,
    "channelId" BIGINT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "statsUserId" BIGINT,
    CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Stats" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("createdAt", "messageId", "statsUserId", "userId") SELECT "createdAt", "messageId", "statsUserId", "userId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE UNIQUE INDEX "Message_messageId_key" ON "Message"("messageId");
CREATE TABLE "new_Stats" (
    "userId" BIGINT NOT NULL PRIMARY KEY,
    "last_message_sent" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "last_online" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message_count_bucket" INTEGER NOT NULL DEFAULT 30
);
INSERT INTO "new_Stats" ("last_message_sent", "last_online", "message_count_bucket", "userId") SELECT "last_message_sent", "last_online", "message_count_bucket", "userId" FROM "Stats";
DROP TABLE "Stats";
ALTER TABLE "new_Stats" RENAME TO "Stats";
CREATE UNIQUE INDEX "Stats_userId_key" ON "Stats"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
