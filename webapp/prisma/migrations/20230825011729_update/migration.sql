/*
  Warnings:

  - You are about to drop the column `userId` on the `CategoryGroup` table. All the data in the column will be lost.
  - Added the required column `budgetId` to the `CategoryGroup` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CategoryGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "budgetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CategoryGroup_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CategoryGroup" ("createdAt", "description", "id", "name") SELECT "createdAt", "description", "id", "name" FROM "CategoryGroup";
DROP TABLE "CategoryGroup";
ALTER TABLE "new_CategoryGroup" RENAME TO "CategoryGroup";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
