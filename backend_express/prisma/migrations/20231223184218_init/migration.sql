/*
  Warnings:

  - A unique constraint covering the columns `[globalId]` on the table `Wallets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `globalId` to the `Wallets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallets" ADD COLUMN     "globalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Wallets_globalId_key" ON "Wallets"("globalId");
