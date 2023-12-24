/* eslint-disable max-len */
import { useEffect, useRef, useState } from 'react';
import {
  SQLiteDBConnection,
  SQLiteConnection,
  CapacitorSQLite,
} from '@capacitor-community/sqlite';

const useSQLiteDB = () => {
  const db = useRef<SQLiteDBConnection>();
  const sqlite = useRef<SQLiteConnection>();
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeDB = async () => {
      if (sqlite.current) return;

      sqlite.current = new SQLiteConnection(CapacitorSQLite);
      const ret = await sqlite.current.checkConnectionsConsistency();
      const isConn = (await sqlite.current.isConnection('splitWallet', false))
        .result;

      if (ret.result && isConn) {
        db.current = await sqlite.current.retrieveConnection(
          'splitWallet',
          false
        );
      } else {
        db.current = await sqlite.current.createConnection(
          'splitWallet',
          false,
          'no-encryption',
          1,
          false
        );
      }
    };

    initializeDB().then(() => {
      initializeTables();
      setInitialized(true);
    });
  }, []);

  const performSQLAction = async (
    action: (db: SQLiteDBConnection | undefined) => Promise<void>,
    cleanup?: () => Promise<void>
  ) => {
    try {
      // SHR If line below is not there, syncWallets will not work, dont ask ....
      const test = await db.current?.isDBOpen();
      // console.log('isDBOpen', test);
      await db.current?.open();
      console.log('actionStart-----------------------', action);
      await action(db.current);
      console.log('actionEnd-----------------------', action);
    } catch (error) {
      console.error('error', (error as Error).message);
      alert((error as Error).message);
    } finally {
      try {
        (await db.current?.isDBOpen())?.result && (await db.current?.close());
        cleanup && (await cleanup());
      } catch {}
    }
  };

  /**
   * here is where you cna check and update table
   * structure
   */
  const initializeTables = async () => {
    console.log('initializeTables');
    performSQLAction(async (db: SQLiteDBConnection | undefined) => {
      const queryCreateTable = `
      -- CreateTable
CREATE TABLE IF NOT EXISTS "Wallets" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "globalId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "total" REAL NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  "isSynced" BOLLEAN
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
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "localId" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" BOLLEAN,
    "image" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

      `;
      const respCT = await db?.execute(queryCreateTable);
      // console.log(`res: ${JSON.stringify(respCT)}`);
    });
  };

  return { performSQLAction, initialized };
};

export default useSQLiteDB;
