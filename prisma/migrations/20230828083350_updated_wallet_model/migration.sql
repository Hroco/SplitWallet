/*
  Warnings:

  - You are about to drop the `_UserToWallets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecieverData" DROP CONSTRAINT "RecieverData_userId_fkey";

-- DropForeignKey
ALTER TABLE "WalletItem" DROP CONSTRAINT "WalletItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserToWallets" DROP CONSTRAINT "_UserToWallets_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToWallets" DROP CONSTRAINT "_UserToWallets_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "walletUserId" TEXT;

-- DropTable
DROP TABLE "_UserToWallets";

-- CreateTable
CREATE TABLE "WalletUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "walletsId" TEXT NOT NULL,

    CONSTRAINT "WalletUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WalletUser" ADD CONSTRAINT "WalletUser_walletsId_fkey" FOREIGN KEY ("walletsId") REFERENCES "Wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletItem" ADD CONSTRAINT "WalletItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WalletUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecieverData" ADD CONSTRAINT "RecieverData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WalletUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_walletUserId_fkey" FOREIGN KEY ("walletUserId") REFERENCES "WalletUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
