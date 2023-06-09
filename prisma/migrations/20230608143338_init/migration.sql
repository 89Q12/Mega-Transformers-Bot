-- CreateTable
CREATE TABLE "User" (
    "user_id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL DEFAULT '',
    "last_message_sent" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_online" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message_points" REAL NOT NULL DEFAULT 10.0
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");
