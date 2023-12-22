/*
  Warnings:

  - You are about to alter the column `resetPasswordExpireTime` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "gender" TEXT,
    "password" TEXT NOT NULL,
    "resetPasswordToken" TEXT,
    "resetPasswordExpireTime" BIGINT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("active", "city", "country", "createdAt", "email", "gender", "id", "name", "password", "resetPasswordExpireTime", "resetPasswordToken", "username", "verified") SELECT "active", "city", "country", "createdAt", "email", "gender", "id", "name", "password", "resetPasswordExpireTime", "resetPasswordToken", "username", "verified" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
