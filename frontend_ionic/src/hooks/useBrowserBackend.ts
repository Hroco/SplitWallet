/* eslint-disable max-len */
import { useEffect, useRef, useState } from 'react';
import useSQLiteDB from '../hooks/useSQLiteDB';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const WalletSchema = z.object({
  globalId: z.string(),
  name: z.string(),
  description: z.string(),
  currency: z.string(),
  category: z.string(),
  userList: z.array(
    z.object({ name: z.string(), email: z.string().optional() })
  ),
  isSynced: z.boolean(),
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

const WalletUserSchemaSync = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  currency: z.string(),
  category: z.string(),
  total: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isSynced: z.number(),
  bilance: z.number(),
  walletsId: z.string(),
  userId: z.string().nullable(),
  WalletItem: z.array(z.unknown()), // Define more specifically if you know the structure of the items
  RecieverData: z.array(z.unknown()), // Define more specifically if you know the structure of the items
  users: z.array(z.unknown()), // Define more specifically if you know the structure of the users
});

const WalletSchemaSync = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  currency: z.string(),
  category: z.string(),
  total: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isSynced: z.number(),
  walletUsers: z.array(WalletUserSchemaSync),
});

export type BrowserBackendFunctions = ReturnType<typeof useBrowserBackend>;

const useBrowserBackend = () => {
  const { performSQLAction, initialized } = useSQLiteDB();

  /* useEffect(() => {
    createTable();
    // setData();
    loadData();
    listOfTables();
  }, [initialized]);*/

  const runQuerry = async (query: string, values?: any[]) => {
    return new Promise<any[] | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          const respSelect = await db?.query(query, values);
          resolve(respSelect?.values);
        } catch (error) {
          reject(error);
        }
      });
    });
    /* let output;

    await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
      const respSelect = await db?.query(query, values);
      output = respSelect?.values;
    });
    return output;*/
  };

  const runExecute = async (query: string, transaction?: boolean) => {
    await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
      await db?.execute(query, transaction);
    });
  };

  const createTable = async () => {
    console.log('Creating tables');
    try {
      // query db
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const respSelect = await db?.query(`
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

        `);
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const listOfTables = async () => {
    return new Promise<any | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          const listOfTables = await runQuerry(
            `SELECT name FROM sqlite_master WHERE type='table';`
          );
          const listOfWallets = await runQuerry(`SELECT * FROM Wallets;`);
          const listOfWalletUsers = await runQuerry(
            `SELECT * FROM WalletUser;`
          );
          const listOfWalletItems = await runQuerry(
            `SELECT * FROM WalletItem;`
          );
          const listOfRecieverData = await runQuerry(
            `SELECT * FROM RecieverData;`
          );
          const users = await runQuerry(`SELECT * FROM User;`);

          console.log('DB Debug Output ------------', {
            listOfTables,
            listOfWallets,
            listOfWalletUsers,
            listOfWalletItems,
            listOfRecieverData,
            users,
          });
          resolve({
            listOfTables,
            listOfWallets,
            listOfWalletUsers,
            listOfWalletItems,
            listOfRecieverData,
            users,
          });
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  const getLocalUser = async () => {
    return new Promise<any | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          if (!db) {
            throw new Error('db is undefined');
          }

          const usersData = await db.query(`SELECT * FROM User;`);

          console.log('getLocalUser TBD', usersData);

          if (!usersData || !usersData.values) {
            throw new Error('error in getting local user');
          }

          if (usersData.values.length === 0) {
            console.log('inserting new user TBD', usersData);
            const id = uuidv4();
            const localId = uuidv4();
            db.query(`INSERT INTO User (id, localId) VALUES (?, ?)`, [
              id,
              localId,
            ]);

            const user = {
              id: id,
              name: null,
              localId: localId,
              email: null,
              emailVerified: null,
              image: null,
            };

            resolve(user);
          }

          resolve(usersData.values[0] as any);
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  // SHR Partially Done
  const getWalletsWithEmail = async (email: string) => {
    return new Promise<any | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          console.log('getWalletsWithEmail TBD', db);
          const wallets = await db?.query(`SELECT * FROM Wallets;`);

          // console.log('getWalletsWithEmail TBD', wallets);

          if (!wallets || !wallets.values) {
            return;
          }

          resolve(wallets.values as any[]);
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  // SHR Done
  const getWalletById = async (id: string) => {
    return new Promise<any | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          const results = await db?.query(`SELECT *
          FROM Wallets
          WHERE id = '${id}';`);

          if (!results || !results.values) {
            throw new Error('wallet not found');
          }

          const walletUsers = await db?.query(`SELECT Wallets.*, WalletUser.*
            FROM Wallets
            LEFT JOIN WalletUser ON Wallets.id = WalletUser.walletsId
            WHERE Wallets.id = '${id}';`);

          if (!walletUsers || !walletUsers.values) {
            throw new Error('walletUsers not found');
          }

          const walletUsersWithAllData = [];

          for (const walletUser of walletUsers.values) {
            const walletItems = await db?.query(
              `SELECT WalletItem.*
              FROM WalletItem
              WHERE WalletItem.userId = '${walletUser.id}';`
            );

            if (!walletItems || !walletItems.values) {
              throw new Error('walletItems not found');
            }

            const recieverData = await db?.query(
              `SELECT RecieverData.*
              FROM RecieverData
              WHERE RecieverData.userId = '${walletUser.id}';`
            );

            if (!recieverData || !recieverData.values) {
              throw new Error('recieverData not found');
            }

            const users = await db?.query(
              `SELECT User.*
              FROM User
              WHERE User.id = '${walletUser.userId}';`
            );

            if (!users || !users.values) {
              throw new Error('users not found');
            }

            walletUsersWithAllData.push({
              ...walletUser,
              WalletItem: walletItems.values,
              RecieverData: recieverData.values,
              users: users.values,
            });
          }

          const walletWithoutUsers: any = results.values[0];

          const wallet = {
            ...walletWithoutUsers,
            walletUsers: walletUsersWithAllData,
          };

          if (!wallet) {
            throw new Error('wallet not found');
          }

          resolve({ wallet });
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  // SHR Partially Done
  const getWalletUserByEmailAndWalletId = async (
    email: string,
    walletId: string
  ) => {
    console.log('getWalletUserByEmailAndWalletId TBD');
    const walletUser = {};

    try {
      // SHR This should find user by his email and walletId code bellow is for testing

      const walletUsers = (await runQuerry(
        `SELECT * FROM WalletUser WHERE walletsId = '${walletId}';`
      )) as any[] | undefined;

      if (!walletUsers) {
        throw new Error('walletUsers not found');
      }

      const walletUser = walletUsers[0];

      return walletUser;
    } catch (error) {
      console.error('error', error);
    }

    return { walletUser };
  };

  // SHR Done
  const getWalletItemsByWalletId = async (id: string) => {
    return new Promise<any | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          const results2 = await db?.query(`SELECT *
            FROM Wallets
            WHERE id = '${id}';`);

          if (!results2 || !results2.values) {
            throw new Error('wallet not found');
          }

          const wallet = results2.values[0];

          if (!wallet) {
            throw new Error('wallet not found');
          }

          const walletItemsWithoutPayer = await db?.query(
            `SELECT * FROM WalletItem WHERE walletsId = '${id}';`
          );

          if (!walletItemsWithoutPayer || !walletItemsWithoutPayer.values) {
            resolve({ wallet, walletItems: [] });
            return;
          }

          const walletItems = [];

          for (const walletItem of walletItemsWithoutPayer.values) {
            const results = await db?.query(
              `SELECT WalletUser.*
              FROM WalletUser
              WHERE WalletUser.id = '${walletItem.userId}';`
            );

            if (!results || !results.values) {
              throw new Error('walletUser not found');
            }

            const payer: any = results.values[0];

            walletItems.push({ ...walletItem, payer });
          }

          resolve({ wallet, walletItems });
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  // SHR Done
  const getWalletItemByWalletItemId = async (id: string) => {
    return new Promise<any | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          const results = await db?.query(
            `SELECT * FROM WalletItem WHERE id = '${id}';`
          );

          if (!results || !results.values) {
            throw new Error('WalletItem not found');
          }

          const walletItemWithoutPayer = results.values[0];

          if (!walletItemWithoutPayer) {
            throw new Error('walletItem not found');
          }

          const results2 = await db?.query(
            `SELECT WalletUser.*
          FROM WalletUser
          WHERE WalletUser.id = '${walletItemWithoutPayer.userId}';`
          );

          if (!results2 || !results2.values) {
            throw new Error('payer not found');
          }

          const payer: any = results2.values[0];

          const recieversWithoutIncludedWalletUsers = await db?.query(
            `SELECT RecieverData.*
          FROM RecieverData
          WHERE RecieverData.walletItemId = '${walletItemWithoutPayer.id}';`
          );

          if (
            !recieversWithoutIncludedWalletUsers ||
            !recieversWithoutIncludedWalletUsers.values
          ) {
            throw new Error('recievers not found');
          }

          const recievers = [];

          for (const reciever of recieversWithoutIncludedWalletUsers.values) {
            const results = await db?.query(
              `SELECT WalletUser.*
          FROM WalletUser
          WHERE WalletUser.id = '${reciever.userId}';`
            );

            if (!results || !results.values) {
              throw new Error('walletUser not found');
            }

            const walletUser: any = results.values[0];

            recievers.push({ ...reciever, reciever: walletUser });
          }

          if (!recievers) {
            throw new Error('recievers not found');
          }

          resolve({ ...walletItemWithoutPayer, payer, recievers });
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  // SHR Done
  const getPrevAndNextWalletItemByWalletItemIdAndSortType = async (
    walletItemId: string,
    sortType: string
  ) => {
    const walletItemPrev = {};
    const walletItemNext = {};

    try {
      const results = (await runQuerry(
        `SELECT * FROM WalletItem WHERE id = '${walletItemId}';`
      )) as any[] | undefined;

      if (!results) {
        throw new Error('walletItem not found');
      }

      const currentWalletItem: any = results[0];

      if (!currentWalletItem) {
        throw new Error('walletItems not found');
      }

      const walletItems = (await runQuerry(`SELECT Wallets.*, WalletItem.*
      FROM Wallets
      LEFT JOIN WalletItem ON Wallets.id = WalletItem.walletsId
      WHERE Wallets.id = '${currentWalletItem.walletsId}';`)) as
        | any[]
        | undefined;

      if (!walletItems) {
        throw new Error('walletItems not found');
      }

      walletItems.sort((a: any, b: any) => {
        switch (sortType) {
          case 'DateAsc':
            return a.date > b.date ? 1 : -1;
          case 'DateDesc':
            return a.date < b.date ? 1 : -1;
          case 'AmountAsc':
            return a.amount > b.amount ? 1 : -1;
          case 'AmountDesc':
            return a.amount < b.amount ? 1 : -1;
          case 'TitleAsc':
            return a.name > b.name ? 1 : -1;
          case 'TitleDesc':
            return a.name < b.name ? 1 : -1;
          case 'PayerAsc':
            return a.payer.name > b.payer.name ? 1 : -1;
          case 'PayerDesc':
            return a.payer.name < b.payer.name ? 1 : -1;
          case 'CategoryAsc':
            return a.type > b.type ? 1 : -1;
          case 'CategoryDesc':
            return a.type < b.type ? 1 : -1;
          default:
            return 0;
        }
      });

      const walletItemIndex = walletItems.findIndex(
        (item: any) => item.id === walletItemId
      );

      let walletItemPrev = null;
      let walletItemNext = null;

      if (walletItemIndex > 0) {
        walletItemPrev = walletItems[walletItemIndex - 1];
      }

      if (walletItemIndex < walletItems.length - 1) {
        walletItemNext = walletItems[walletItemIndex + 1];
      }

      return { walletItemPrev, walletItemNext };
    } catch (error) {
      console.error('error', error);
    }

    return { walletItemPrev, walletItemNext };
  };

  // SHR Done
  const getWalletUsersByWalletId = async (id: string) => {
    return new Promise<any[]>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          const walletUsers = await db?.query(
            `SELECT * FROM WalletUser WHERE walletsId = '${id}';`
          );

          if (!walletUsers || !walletUsers.values) {
            throw new Error('walletUsers not found');
          }

          resolve(walletUsers.values);
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  // SHR Done
  const addWallet = async (input: z.infer<typeof WalletSchema>) => {
    return new Promise<boolean | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          console.log('addWallet input', input);
          const validationResult = WalletSchema.safeParse(input);

          if (!validationResult.success) {
            throw new Error('validationResult error');
          }

          const transactionQueries = [];

          const walletId = uuidv4();

          transactionQueries.push({
            statement: `INSERT INTO Wallets (id, globalId, name, description, currency, category, createdAt, updatedAt, isSynced) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
            values: [
              walletId,
              input.globalId,
              input.name,
              input.description,
              input.currency,
              input.category,
              input.isSynced,
            ],
          });

          for (const user of input.userList) {
            const walletUserId = uuidv4();

            transactionQueries.push({
              statement: `INSERT INTO WalletUser (id, name, bilance, total, createdAt, updatedAt, walletsId) VALUES (?, ?, '0', '0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
              values: [walletUserId, user.name, walletId],
            });
          }

          // console.log('transactionQueries', transactionQueries);

          await db?.executeTransaction(transactionQueries, false);

          resolve(true);
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  // SHR Done
  const addWalletItem = async (input: z.infer<typeof WalletItemSchema>) => {
    return new Promise<boolean | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          const validationResult = WalletItemSchema.safeParse(input);

          if (!validationResult.success) {
            throw new Error('validationResult error');
          }

          const transactionQueries = [];

          const walletItemId = uuidv4();
          const date = new Date(input.date)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

          transactionQueries.push({
            statement: `INSERT INTO WalletItem (id, name, tags, amount, type, date, createdAt, updatedAt, walletsId, userId) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?) `,
            values: [
              walletItemId,
              input.name,
              input.tags,
              input.amount,
              input.type,
              date,
              input.walletId,
              input.payer,
            ],
          });

          for (const receiver of input.recieversData) {
            const receiverId = uuidv4();
            transactionQueries.push({
              statement: `INSERT INTO RecieverData (id, userId, amount, createdAt, updatedAt, walletItemId) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?) `,
              values: [
                receiverId,
                receiver.id,
                receiver.cutFromAmount,
                walletItemId,
              ],
            });
          }
          // Update bliance of payer
          let newBilance = 0;
          if (input.type === 'expense' || input.type === 'moneyTransfer') {
            newBilance += input.amount;
          }
          if (input.type === 'income') {
            newBilance -= input.amount;
          }

          transactionQueries.push({
            statement: `UPDATE WalletUser SET bilance = bilance + ? WHERE id = ?`,
            values: [newBilance, input.payer],
          });

          let newTotal = 0;
          if (input.type === 'expense') {
            newTotal += input.amount;
          }
          if (input.type === 'income') {
            newTotal -= input.amount;
          }
          // Monney transfer doesnt affect total

          transactionQueries.push({
            statement: `UPDATE Wallets SET total = total + ? WHERE id = ?`,
            values: [newTotal, input.walletId],
          });

          // Update bliance of recievers
          for (const receiver of input.recieversData) {
            let newBilance = 0;
            let newTotal = 0;

            if (input.type === 'expense') {
              newBilance -= receiver.cutFromAmount;
              newTotal += receiver.cutFromAmount;
            }
            if (input.type === 'income') {
              newBilance += receiver.cutFromAmount;
              newTotal -= receiver.cutFromAmount;
            }
            if (input.type === 'moneyTransfer') {
              newBilance -= receiver.cutFromAmount;
            }

            transactionQueries.push({
              statement: `UPDATE WalletUser SET bilance = bilance + ?, total = total + ? WHERE id = ?`,
              values: [newBilance, newTotal, receiver.id],
            });
          }

          // console.log('transactionQueries', transactionQueries);

          await db?.executeTransaction(transactionQueries, false);

          resolve(true);
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  // SHR Todo
  const editWalletItem = async (
    id: string,
    input: z.infer<typeof WalletItemSchema>
  ) => {
    return new Promise<boolean | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          // Validate input
          const validationResult = WalletItemSchema.safeParse(input);

          if (!validationResult.success) {
            throw new Error('validationResult error');
          }

          const transactionQueries = [];

          const results = await db?.query(
            'SELECT * FROM WalletItem WHERE id = ?',
            [id]
          );

          if (!results || !results.values || results.values.length === 0) {
            throw new Error('WalletItem not found');
          }

          const walletItemWithoutPayer = results.values[0];

          if (!walletItemWithoutPayer) {
            throw new Error('walletItem not found');
          }

          // Query the payer
          const results2 = await db?.query(
            'SELECT WalletUser.* FROM WalletUser WHERE WalletUser.id = ?',
            [walletItemWithoutPayer.userId]
          );

          if (!results2 || !results2.values || results2.values.length === 0) {
            throw new Error('payer not found');
          }

          const payer: any = results2.values[0];

          const recieversWithoutIncludedWalletUsers = await db?.query(
            'SELECT RecieverData.* FROM RecieverData WHERE RecieverData.walletItemId = ?',
            [walletItemWithoutPayer.id]
          );

          if (
            !recieversWithoutIncludedWalletUsers ||
            !recieversWithoutIncludedWalletUsers.values
          ) {
            throw new Error('recievers not found');
          }

          const recievers = [];

          for (const reciever of recieversWithoutIncludedWalletUsers.values) {
            const results = await db?.query(
              'SELECT WalletUser.* FROM WalletUser WHERE WalletUser.id = ?',
              [reciever.userId]
            );

            if (!results || !results.values || results.values.length === 0) {
              throw new Error('walletUser not found');
            }

            const walletUser: any = results.values[0];

            recievers.push({ ...reciever, reciever: walletUser });
          }

          if (!recievers) {
            throw new Error('recievers not found');
          }

          const oldWalletItem = { ...walletItemWithoutPayer, payer, recievers };

          transactionQueries.push({
            statement: 'DELETE FROM RecieverData WHERE walletItemId = ?',
            values: [id],
          });

          const date = new Date(input.date)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

          transactionQueries.push({
            statement:
              'UPDATE WalletItem SET name = ?, amount = ?, date = ?, tags = ?, type = ?, userId = ? WHERE id = ?',
            values: [
              input.name,
              input.amount,
              date,
              input.tags,
              input.type,
              input.payer,
              id,
            ],
          });

          for (const receiver of input.recieversData) {
            const receiverId = uuidv4();
            transactionQueries.push({
              statement:
                'INSERT INTO RecieverData (id, userId, amount, createdAt, updatedAt, walletItemId) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)',
              values: [receiverId, receiver.id, receiver.cutFromAmount, id],
            });
          }

          // Remove bilance from old payer
          let oldBalance = 0;
          if (
            oldWalletItem.type === 'expense' ||
            oldWalletItem.type === 'moneyTransfer'
          ) {
            oldBalance -= oldWalletItem.amount;
          }
          if (oldWalletItem.type === 'income') {
            oldBalance += oldWalletItem.amount;
          }

          transactionQueries.push({
            statement:
              'UPDATE WalletUser SET bilance = bilance + ? WHERE id = ?',
            values: [oldBalance, payer.id],
          });

          // Update bliance of new payer
          let newBalance = 0;
          if (input.type === 'expense' || input.type === 'moneyTransfer') {
            newBalance += input.amount;
          }
          if (input.type === 'income') {
            newBalance -= input.amount;
          }

          transactionQueries.push({
            statement:
              'UPDATE WalletUser SET bilance = bilance + ? WHERE id = ?',
            values: [newBalance, input.payer],
          });

          // Update Wallet Total of payer
          // Remove old total
          let oldTotal = 0;
          if (oldWalletItem.type === 'expense') {
            oldTotal -= oldWalletItem.amount;
          }
          if (oldWalletItem.type === 'income') {
            oldTotal += oldWalletItem.amount;
          }

          // Add New total
          let newTotal = 0;
          if (input.type === 'expense') {
            newTotal += input.amount;
          }
          if (input.type === 'income') {
            newTotal -= input.amount;
          }
          // Monney transfer doesnt affect total

          transactionQueries.push({
            statement: 'UPDATE Wallets SET total = total + ? + ? WHERE id = ?',
            values: [oldTotal, newTotal, oldWalletItem.walletsId],
          });

          // Remove old bilance from old receivers
          for (const receiver of oldWalletItem.recievers) {
            let oldBalance = 0;
            let oldTotal = 0;
            if (oldWalletItem.type === 'expense') {
              oldBalance += receiver.amount;
              oldTotal -= receiver.amount;
            }
            if (oldWalletItem.type === 'income') {
              oldBalance -= receiver.amount;
              oldTotal += receiver.amount;
            }
            if (oldWalletItem.type === 'moneyTransfer') {
              oldBalance += receiver.amount;
            }

            transactionQueries.push({
              statement:
                'UPDATE WalletUser SET bilance = bilance + ?, total = total + ? WHERE id = ?',
              values: [oldBalance, oldTotal, receiver.reciever.id],
            });
          }

          // Update bliance of recievers
          for (const receiver of input.recieversData) {
            let newBilance = 0;
            let newTotal = 0;

            if (input.type === 'expense') {
              newBilance -= receiver.cutFromAmount;
              newTotal += receiver.cutFromAmount;
            }
            if (input.type === 'income') {
              newBilance += receiver.cutFromAmount;
              newTotal -= receiver.cutFromAmount;
            }
            if (input.type === 'moneyTransfer') {
              newBilance -= receiver.cutFromAmount;
            }

            transactionQueries.push({
              statement: `UPDATE WalletUser SET bilance = bilance + ?, total = total + ? WHERE id = ?`,
              values: [newBilance, newTotal, receiver.id],
            });
          }

          // console.log('transactionQueries', transactionQueries);

          await db?.executeTransaction(transactionQueries, false);

          resolve(true);
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  // SHR Done
  const editWallet = async (
    id: string,
    input: any // z.infer<typeof WalletSchema>
  ) => {
    return new Promise<boolean | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          const validationResult = WalletSchema.safeParse(input);

          if (!validationResult.success) {
            throw new Error('validationResult error');
          }

          const transactionQueries = [];

          const results = await db?.query(`SELECT *
            FROM Wallets
            WHERE id = '${id}';`);

          if (!results || !results.values) {
            throw new Error('wallet not found');
          }

          const walletUsers = await db?.query(`SELECT Wallets.*, WalletUser.*
            FROM Wallets
            LEFT JOIN WalletUser ON Wallets.id = WalletUser.walletsId
            WHERE Wallets.id = '${id}';`);

          if (!walletUsers || !walletUsers.values) {
            throw new Error('walletUsers not found');
          }

          const walletWithoutUsers: any = results.values[0];

          const oldWallet = {
            ...walletWithoutUsers,
            walletUsers: walletUsers.values,
          };

          if (!oldWallet) {
            throw new Error('wallet not found');
          }

          const createOperations: any[] = [];

          for (const user of input.userList) {
            if (user.id == null) {
              createOperations.push({
                name: user.name,
                walletId: id,
              });
            }
          }

          let updateOperations: any[] = [];

          for (const user of input.userList) {
            if (user.id != null) {
              const existingItem = oldWallet.walletUsers.find(
                (dbItem: any) => dbItem.id === user.id
              );

              if (existingItem) {
                updateOperations.push({
                  id: user.id,
                  name: user.name,
                });
              }
            }
          }

          if (updateOperations) {
            updateOperations = updateOperations.filter((op: any) => !op.delete);
          }

          const deleteOperations: any[] = [];

          // Determine items to delete
          for (const dbUser of walletUsers.values) {
            if (
              !input.userList.some((newUser: any) => newUser.id === dbUser.id)
            ) {
              deleteOperations.push(dbUser.id);
            }
          }
          // Update wallet
          transactionQueries.push({
            statement: `UPDATE Wallets SET name = ?, description = ?, currency = ?, category = ? WHERE id = ?`,
            values: [
              input.name,
              input.description,
              input.currency,
              input.category,
              id,
            ],
          });

          // Insert new wallet users
          if (createOperations.length > 0) {
            for (const operation of createOperations) {
              const walletUserId = uuidv4();

              transactionQueries.push({
                statement: `INSERT INTO WalletUser (id, name, bilance, total, createdAt, updatedAt, walletsId) VALUES (?, ?, '0', '0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
                values: [walletUserId, operation.name, operation.walletId],
              });
            }
          }

          // Update existing wallet users
          if (updateOperations.length > 0) {
            for (const operation of updateOperations) {
              transactionQueries.push({
                statement: `UPDATE WalletUser SET name = ? WHERE id = ?`,
                values: [operation.name, operation.id],
              });
            }
          }

          // Delete wallet users
          if (deleteOperations.length > 0) {
            for (const operation of deleteOperations) {
              transactionQueries.push({
                statement: `DELETE FROM WalletUser WHERE id = ?`,
                values: [operation],
              });
            }
          }

          // console.log('transactionQueries', transactionQueries);

          await db?.executeTransaction(transactionQueries, false);

          resolve(true);
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  async function delay(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  // SHR Todo
  const deleteWalletItemById = async (id: string) => {
    return new Promise<boolean | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          const transactionQueries = [];

          const results = await db?.query(
            'SELECT * FROM WalletItem WHERE id = ?',
            [id]
          );

          if (!results || !results.values || results.values.length === 0) {
            throw new Error('WalletItem not found');
          }

          const walletItemWithoutPayer = results.values[0];

          if (!walletItemWithoutPayer) {
            throw new Error('walletItem not found');
          }

          // Query the payer
          const results2 = await db?.query(
            'SELECT WalletUser.* FROM WalletUser WHERE WalletUser.id = ?',
            [walletItemWithoutPayer.userId]
          );

          if (!results2 || !results2.values || results2.values.length === 0) {
            throw new Error('payer not found');
          }

          const payer: any = results2.values[0];

          const recieversWithoutIncludedWalletUsers = await db?.query(
            'SELECT RecieverData.* FROM RecieverData WHERE RecieverData.walletItemId = ?',
            [walletItemWithoutPayer.id]
          );

          if (
            !recieversWithoutIncludedWalletUsers ||
            !recieversWithoutIncludedWalletUsers.values
          ) {
            throw new Error('recievers not found');
          }

          const recievers = [];

          for (const reciever of recieversWithoutIncludedWalletUsers.values) {
            const results = await db?.query(
              'SELECT WalletUser.* FROM WalletUser WHERE WalletUser.id = ?',
              [reciever.userId]
            );

            if (!results || !results.values || results.values.length === 0) {
              throw new Error('walletUser not found');
            }

            const walletUser: any = results.values[0];

            recievers.push({ ...reciever, reciever: walletUser });
          }

          if (!recievers) {
            throw new Error('recievers not found');
          }

          const oldWalletItem = { ...walletItemWithoutPayer, payer, recievers };

          // Remove bilance from old payer
          let oldBalance = 0;
          if (
            oldWalletItem.type === 'expense' ||
            oldWalletItem.type === 'moneyTransfer'
          ) {
            oldBalance -= oldWalletItem.amount;
          }
          if (oldWalletItem.type === 'income') {
            oldBalance += oldWalletItem.amount;
          }

          transactionQueries.push({
            statement:
              'UPDATE WalletUser SET bilance = bilance + ? WHERE id = ?',
            values: [oldBalance, payer.id],
          });

          // Remove Wallet Total of payer
          // Remove old total and apply new total
          let newTotal = 0;
          if (oldWalletItem.type === 'expense') {
            newTotal -= oldWalletItem.amount;
          }
          if (oldWalletItem.type === 'income') {
            newTotal += oldWalletItem.amount;
          }
          // Monney transfer doesnt affect total

          transactionQueries.push({
            statement: 'UPDATE Wallets SET total = total + ? WHERE id = ?',
            values: [newTotal, oldWalletItem.walletsId],
          });

          // Remove old bliance from old recievers
          for (const receiver of oldWalletItem.recievers) {
            let oldBilance = 0;
            let oldTotal = 0;
            if (oldWalletItem.type === 'expense') {
              oldBilance += receiver.amount;
              oldTotal -= receiver.amount;
            }
            if (oldWalletItem.type === 'income') {
              oldBilance -= receiver.amount;
              oldTotal += receiver.amount;
            }
            if (oldWalletItem.type === 'moneyTransfer') {
              oldBilance += receiver.amount;
            }

            transactionQueries.push({
              statement:
                'UPDATE WalletUser SET bilance = bilance + ?, total = total + ? WHERE id = ?',
              values: [oldBilance, oldTotal, receiver.reciever.id],
            });
          }

          transactionQueries.push({
            statement: 'DELETE FROM WalletItem WHERE id = ?',
            values: [id],
          });

          // console.log('transactionQueries', transactionQueries);

          await db?.executeTransaction(transactionQueries, false);

          resolve(true);
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  // SHR Done
  const deleteWalletById = async (id: string) => {
    try {
      const query = `DELETE FROM Wallets WHERE id = '${id}'`;
      await runQuerry(query);
    } catch (error) {
      console.error('error', error);
    }
  };

  // SHR TBD
  const getUnsyncedWallets = async () => {
    console.log('getUnsyncedWallets TBD');

    const walletsWithAllData = [];

    try {
      const walletsWithoutAllData = (await runQuerry(
        `SELECT * FROM Wallets WHERE isSynced = '0';`
      )) as any[] | undefined;

      if (!walletsWithoutAllData) {
        throw new Error('getUnsyncedWallets error');
      }

      for (const wallets of walletsWithoutAllData) {
        // console.log('getting full wallet');
        const fullWallet = await getWalletById(wallets.id);

        // console.log('fullWallet', fullWallet);
        walletsWithAllData.push(fullWallet.wallet);
      }

      return walletsWithAllData;
    } catch (error) {
      console.error('error', error);
      throw new Error('getUnsyncedWallets error');
    }

    return walletsWithAllData;
  };

  // SHR TBD
  const markWalletAsSynced = async (input: any) => {
    console.log('markWalletAsSynced TBD');

    return new Promise<boolean | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          const transactionQueries = [];

          for (const wallet of input) {
            console.log('wallett', wallet);

            // Update wallet
            transactionQueries.push({
              statement: `UPDATE Wallets SET isSynced = ? WHERE id = ?`,
              values: [1, wallet.id],
            });
          }

          await db?.executeTransaction(transactionQueries, false);
          resolve(true);
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  const applyUpdateToLocalDB = async (input: any) => {
    // console.log('applyUpdateToLocalDB TBD');
    return new Promise<boolean | undefined>(async (resolve, reject) => {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        try {
          const transactionQueries = [];

          for (const wallet of input) {
            console.log('wallet', wallet);
            const results = await db?.query(`SELECT *
              FROM Wallets
              WHERE globalId = '${wallet.globalId}';`);

            console.log('results', results);

            if (results && results.values?.length === 0) {
              console.log('wallet not found creating new one');
              transactionQueries.push({
                statement: `INSERT INTO Wallets (id, globalId, name, description, currency, category, createdAt, updatedAt, isSynced) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
                values: [
                  wallet.id,
                  wallet.globalId,
                  wallet.name,
                  wallet.description,
                  wallet.currency,
                  wallet.category,
                  1,
                ],
              });

              for (const user of wallet.walletUsers) {
                transactionQueries.push({
                  statement: `INSERT INTO WalletUser (id, name, bilance, total, createdAt, updatedAt, walletsId) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`,
                  values: [
                    user.id,
                    user.name,
                    user.bilance,
                    user.total,
                    wallet.id,
                  ],
                });
              }
            } else if (results && results.values?.length === 1) {
              console.log('wallet found updating');
            } else {
              console.log('error');
              throw new Error('error');
            }
          }
          console.log('transactionQueries', transactionQueries);
          const response = await db?.executeTransaction(
            transactionQueries,
            false
          );
          console.log('response', response);
          resolve(true);
        } catch (error) {
          console.error('error', error);
          reject(error);
        }
      });
    });
  };

  return {
    createTable,
    listOfTables,
    getLocalUser,
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
    initialized,
    getUnsyncedWallets,
    markWalletAsSynced,
    applyUpdateToLocalDB,
  };
};

export default useBrowserBackend;
