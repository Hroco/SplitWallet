-- AlterTable
ALTER TABLE "RecieverData" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WalletItem" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WalletUser" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Wallets" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
