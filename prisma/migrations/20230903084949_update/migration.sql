-- DropForeignKey
ALTER TABLE "RecieverData" DROP CONSTRAINT "RecieverData_userId_fkey";

-- AddForeignKey
ALTER TABLE "RecieverData" ADD CONSTRAINT "RecieverData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WalletUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
