-- DropForeignKey
ALTER TABLE "WalletUser" DROP CONSTRAINT "WalletUser_userId_fkey";

-- AlterTable
ALTER TABLE "WalletUser" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "WalletUser" ADD CONSTRAINT "WalletUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
