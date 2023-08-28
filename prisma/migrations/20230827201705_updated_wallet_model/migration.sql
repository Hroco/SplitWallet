/*
  Warnings:

  - You are about to drop the column `curency` on the `Wallets` table. All the data in the column will be lost.
  - Added the required column `currency` to the `Wallets` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Wallets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Wallets" DROP COLUMN "curency",
ADD COLUMN     "currency" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
