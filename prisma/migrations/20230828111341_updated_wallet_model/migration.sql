/*
  Warnings:

  - You are about to drop the column `walletUserId` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `WalletUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_walletUserId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "walletUserId";

-- AlterTable
ALTER TABLE "WalletUser" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WalletUser" ADD CONSTRAINT "WalletUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
