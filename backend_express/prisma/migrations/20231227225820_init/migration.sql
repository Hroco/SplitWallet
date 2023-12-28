/*
  Warnings:

  - You are about to drop the column `globalId` on the `Wallets` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Wallets_globalId_key";

-- AlterTable
ALTER TABLE "Wallets" DROP COLUMN "globalId";
