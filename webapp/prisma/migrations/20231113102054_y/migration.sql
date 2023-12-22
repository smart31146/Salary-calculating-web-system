-- AlterTable
ALTER TABLE "User" ADD COLUMN "resetPasswordExpireTime" INTEGER;
ALTER TABLE "User" ADD COLUMN "resetPasswordToken" TEXT;
