/*
  Warnings:

  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Example";

-- CreateTable
CREATE TABLE "Wallets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "curency" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tags" TEXT[],
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "walletsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WalletItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecieverData" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "walletItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RecieverData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToWallets" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToWallets_AB_unique" ON "_UserToWallets"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToWallets_B_index" ON "_UserToWallets"("B");

-- AddForeignKey
ALTER TABLE "WalletItem" ADD CONSTRAINT "WalletItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletItem" ADD CONSTRAINT "WalletItem_walletsId_fkey" FOREIGN KEY ("walletsId") REFERENCES "Wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecieverData" ADD CONSTRAINT "RecieverData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecieverData" ADD CONSTRAINT "RecieverData_walletItemId_fkey" FOREIGN KEY ("walletItemId") REFERENCES "WalletItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWallets" ADD CONSTRAINT "_UserToWallets_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWallets" ADD CONSTRAINT "_UserToWallets_B_fkey" FOREIGN KEY ("B") REFERENCES "Wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
