-- DropForeignKey
ALTER TABLE "RecieverData" DROP CONSTRAINT "RecieverData_walletItemId_fkey";

-- DropForeignKey
ALTER TABLE "WalletItem" DROP CONSTRAINT "WalletItem_walletsId_fkey";

-- DropForeignKey
ALTER TABLE "WalletUser" DROP CONSTRAINT "WalletUser_walletsId_fkey";

-- AddForeignKey
ALTER TABLE "WalletUser" ADD CONSTRAINT "WalletUser_walletsId_fkey" FOREIGN KEY ("walletsId") REFERENCES "Wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletItem" ADD CONSTRAINT "WalletItem_walletsId_fkey" FOREIGN KEY ("walletsId") REFERENCES "Wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecieverData" ADD CONSTRAINT "RecieverData_walletItemId_fkey" FOREIGN KEY ("walletItemId") REFERENCES "WalletItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
