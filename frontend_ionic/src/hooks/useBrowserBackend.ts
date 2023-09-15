/* eslint-disable max-len */
import { useEffect, useRef, useState } from 'react';
import useSQLiteDB from '../hooks/useSQLiteDB';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const WalletSchema = z.object({
  name: z.string(),
  description: z.string(),
  currency: z.string(),
  category: z.string(),
  userList: z.array(
    z.object({ name: z.string(), email: z.string().optional() })
  ),
});

const WalletItemSchema = z.object({
  walletId: z.string(),
  name: z.string(),
  amount: z.number(),
  date: z.date(),
  payer: z.string(),
  tags: z.string().optional(),
  recieversData: z.array(
    z.object({ id: z.string(), cutFromAmount: z.number() })
  ),
  type: z.string(),
});

const useBrowserBackend = () => {
  const { performSQLAction, initialized } = useSQLiteDB();

  /* useEffect(() => {
    createTable();
    // setData();
    loadData();
    listOfTables();
  }, [initialized]);*/

  const createTable = async () => {
    try {
      // query db
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const respSelect = await db?.query(`
        -- CreateTable
CREATE TABLE IF NOT EXISTS "Wallets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "total" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WalletUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "bilance" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "walletsId" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "WalletUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "WalletUser_walletsId_fkey" FOREIGN KEY ("walletsId") REFERENCES "Wallets" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WalletItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "walletsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "WalletItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WalletUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WalletItem_walletsId_fkey" FOREIGN KEY ("walletsId") REFERENCES "Wallets" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "RecieverData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "walletItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "RecieverData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WalletUser" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecieverData_walletItemId_fkey" FOREIGN KEY ("walletItemId") REFERENCES "WalletItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

        `);
        console.log('createTable respSelect?.values', respSelect?.values);
      });
    } catch (error) {
      alert((error as Error).message);
      console.log('error', error);
    }
  };

  const loadData = async () => {
    try {
      // query db
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const respSelect = await db?.query(`SELECT * FROM Wallets`);
        console.log('respSelect?.values', respSelect?.values);
      });
    } catch (error) {
      alert((error as Error).message);
      console.log('error', error);
    }
  };

  const setData = async () => {
    console.log('setData');
    try {
      // query db
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const query = `SELECT name FROM sqlite_master WHERE type='table';
    `;

        const respSelect = await db?.query(query);
        console.log('respSelect?.values', respSelect?.values);
      });
    } catch (error) {
      alert((error as Error).message);
      console.log('error', error);
    }
  };

  const listOfTables = async () => {
    console.log('setData');
    try {
      // query db
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const query = `SELECT name FROM sqlite_master WHERE type='table';
    `;

        const respSelect = await db?.query(query);
        console.log('list of tables ------------', respSelect?.values);
      });
    } catch (error) {
      alert((error as Error).message);
      console.log('error', error);
    }
  };

  const getWalletsWithEmail = async (email: string) => {
    console.log('getWalletsWithEmail begin TBD');

    let wallets: any[] | undefined = [];

    try {
      // query db
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const query = `SELECT * FROM Wallets;
    `;

        const respSelect = await db?.query(query);

        wallets = respSelect?.values;

        console.log('backend wallets-------', wallets);
      });
    } catch (error) {
      alert((error as Error).message);
      console.log('error', error);
    }

    console.log('getWalletsWithEmail return TBD');
    return wallets;
  };

  const getWalletById = async (id: string) => {
    console.log('getWalletById TBD');
    const wallet = {};

    return { wallet };
  };

  const getWalletUserByEmailAndWalletId = async (
    email: string,
    walletId: string
  ) => {
    console.log('getWalletUserByEmailAndWalletId TBD');
    const walletUser = {};

    return { walletUser };
  };

  const getWalletItemsByWalletId = async (id: string) => {
    console.log('getWalletItemsByWalletId TBD');
    const wallet = {};
    const walletItems = {};

    return { wallet, walletItems };
  };

  const getWalletItemByWalletItemId = async (id: string) => {
    console.log('getWalletItemByWalletItemId TBD');
    const walletItem = {};

    return { walletItem };
  };

  const getPrevAndNextWalletItemByWalletItemIdAndSortType = async (
    walletItemId: string,
    sortType: string
  ) => {
    console.log('getPrevAndNextWalletItemByWalletItemIdAndSortType TBD');
    const walletItemPrev = {};
    const walletItemNext = {};

    return { walletItemPrev, walletItemNext };
  };

  const getWalletUsersByWalletId = async (id: string) => {
    console.log('getWalletUsersByWalletId TBD');
    const walletUsers = {};

    return { walletUsers };
  };

  const addWallet = async (input: z.infer<typeof WalletSchema>) => {
    console.log('addWallet TBD');

    const validationResult = WalletSchema.safeParse(input);

    if (!validationResult.success) {
      return false;
    }

    console.log('validationResult TBD');

    try {
      // query db
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const walletId = uuidv4();
        const query = `INSERT INTO Wallets (id, name, description, currency, category, createdAt, updatedAt) VALUES ('${walletId}', '${input.name}', '${input.description}', '${input.currency}', '${input.category}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

        console.log(query);

        const respSelect = await db?.query(query);

        console.log('query 1 pass');

        for (const user of input.userList) {
          const walletUserId = uuidv4();
          const query = `INSERT INTO WalletUser (id, name, bilance, total, createdAt, updatedAt, walletsId) VALUES ('${walletUserId}', '${user.name}', '0', '0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '${walletId}')`;
          const respSelect = await db?.query(query);
        }

        console.log('addWallet wallets-------', respSelect?.values);
      });
    } catch (error) {
      alert((error as Error).message);
      console.log('error', error);
    }

    return true;
  };

  const addWalletItem = async (input: z.infer<typeof WalletItemSchema>) => {
    console.log('addWalletItem TBD');
  };

  const editWalletItem = async (
    id: string,
    input: z.infer<typeof WalletItemSchema>
  ) => {
    console.log('editWalletItem TBD');
  };

  const editWallet = async (
    id: string,
    input: z.infer<typeof WalletSchema>
  ) => {
    console.log('editWallet TBD');
  };

  const deleteWalletItemById = async (id: string) => {
    console.log('deleteWalletItemById TBD');
  };

  const deleteWalletById = async (id: string) => {
    console.log('deleteWalletById TBD');
  };

  return {
    createTable,
    listOfTables,
    getWalletsWithEmail,
    getWalletById,
    getWalletUserByEmailAndWalletId,
    getWalletItemsByWalletId,
    getWalletItemByWalletItemId,
    getPrevAndNextWalletItemByWalletItemIdAndSortType,
    getWalletUsersByWalletId,
    addWallet,
    addWalletItem,
    editWalletItem,
    editWallet,
    deleteWalletItemById,
    deleteWalletById,
  };
};

export default useBrowserBackend;
