/* eslint-disable max-len */
import { useEffect, useRef, useState } from "react";
import useSQLiteDB from "./useSQLiteDB";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import SplitWalletDataSource from "../data-sources/SplitWalletDataSource";
import { Wallets } from "../entity/wallets";
import { WalletItem } from "../entity/walletItem";
import { WalletUser } from "../entity/walletUser";
import { RecieverData } from "../entity/recieverData";
import { User } from "../entity/user";
import { Capacitor } from "@capacitor/core";
import sqliteConnection from "../database";
import { Repository } from "typeorm";
import { save } from "ionicons/icons";

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
  const database = useRef<string | Uint8Array | undefined>(
    SplitWalletDataSource.options.database
  );
  const walletsRepository = useRef<Repository<Wallets>>(null!);
  const walletItemsRepository = useRef<Repository<WalletItem>>(null!);
  const walletUserRepository = useRef<Repository<WalletUser>>(null!);
  const recieverDataRepository = useRef<Repository<RecieverData>>(null!);
  const userRepository = useRef<Repository<User>>(null!);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    walletsRepository.current = SplitWalletDataSource.getRepository(Wallets);
    walletItemsRepository.current =
      SplitWalletDataSource.getRepository(WalletItem);
    walletUserRepository.current =
      SplitWalletDataSource.getRepository(WalletUser);
    recieverDataRepository.current =
      SplitWalletDataSource.getRepository(RecieverData);
    userRepository.current = SplitWalletDataSource.getRepository(User);

    await saveToStore();

    (window as any).listOfTables = listOfTables;
    (window as any).clearDB = clearDB;

    // clearDB();

    setInitialized(true);
    /*
    /*let wallets = await walletsRepository.current.find({
      relations: ["walletUsers"],
    });
    console.log("wallets-------------------------", wallets);

    let walletUsers = await walletUserRepository.current.find();
    console.log("walletUsers-------------------------", walletUsers);
    */
  }

  // This will save data to disc, they are saved in memory by default
  const saveToStore = async () => {
    if (
      Capacitor.getPlatform() === "web" &&
      typeof database.current === "string"
    ) {
      await sqliteConnection.saveToStore(database.current);
    }
  };

  const clearDB = async () => {
    await walletsRepository.current.clear();
    await walletItemsRepository.current.clear();
    await walletUserRepository.current.clear();
    await recieverDataRepository.current.clear();
    await userRepository.current.clear();

    await saveToStore();

    return true;
  };

  const listOfTables = async () => {
    const listOfWallets = await walletsRepository.current.find({
      relations: {
        walletUsers: {
          recieverData: true,
          users: true,
          Wallets: true,
          walletItems: true,
        },
        walletItems: {
          payer: true,
          recievers: true,
          Wallets: true,
        },
      },
    });
    const listOfWalletUsers = await walletUserRepository.current.find({
      relations: {
        recieverData: true,
        users: true,
        Wallets: true,
        walletItems: true,
      },
    });
    const listOfWalletItems = await walletItemsRepository.current.find({
      relations: {
        payer: true,
        recievers: true,
        Wallets: true,
      },
    });
    const listOfRecieverData = await recieverDataRepository.current.find({
      relations: {
        WalletItem: true,
        reciever: true,
      },
    });
    const users = await userRepository.current.find();

    console.log("DB Debug Output ------------", {
      listOfWallets,
      listOfWalletUsers,
      listOfWalletItems,
      listOfRecieverData,
      users,
    });
  };

  const getLocalUser = async () => {
    let users = await userRepository.current.find();
    // console.log("getLocalUser", users);
    if (users.length === 0) {
      // console.log("inserting new user TBD", users);

      const localUser = new User();
      localUser.localId = uuidv4();
      await userRepository.current.save(localUser);

      await saveToStore();
    }

    let usersNew = await userRepository.current.find();

    return usersNew[0];
  };

  // SHR Partially Done
  const getWalletsWithEmail = async (email: string) => {
    const wallets = await walletsRepository.current.find();
    return wallets;
  };

  // SHR Done
  const getWalletById = async (id: string) => {
    console.log("getWalletById TBD");
    let wallet = await walletsRepository.current.findOne({
      where: {
        id: id,
      },
      relations: {
        walletUsers: {
          recieverData: true,
          users: true,
          Wallets: true,
          walletItems: true,
        },
      },
    });

    console.log("getWalletById", wallet);

    return { wallet };
  };

  // SHR Partially Done
  const getWalletUserByEmailAndWalletId = async (
    email: string,
    walletId: string
  ) => {
    console.log("getWalletUserByEmailAndWalletId TBD");
    // SHR This should find user by his email and walletId code bellow is for testing

    let walletUser = await walletUserRepository.current.findOne({
      where: {
        walletsId: walletId,
      },
    });

    console.log("getWalletUserByEmailAndWalletId", walletUser);

    return walletUser;
  };

  // SHR Done
  const getWalletItemsByWalletId = async (id: string) => {
    let wallet = await walletsRepository.current.findOne({
      where: {
        id: id,
      },
      relations: {
        walletItems: {
          payer: true,
        },
      },
    });

    console.log("getWalletItemsByWalletId", {
      wallet,
      walletItems: wallet?.walletItems,
    });

    return { wallet, walletItems: wallet?.walletItems };
  };

  // SHR Done
  const getWalletItemByWalletItemId = async (id: string) => {
    let walletItem = await walletItemsRepository.current.findOne({
      where: {
        id: id,
      },
      relations: {
        payer: true,
        recievers: {
          reciever: true,
        },
      },
    });

    console.log("getWalletItemByWalletItemId", walletItem);

    return walletItem;
  };

  // SHR Done
  const getPrevAndNextWalletItemByWalletItemIdAndSortType = async (
    walletItemId: string,
    sortType: string
  ) => {
    let currentWalletItem = await walletItemsRepository.current.findOne({
      where: {
        id: walletItemId,
      },
    });

    let walletItems = await walletItemsRepository.current.find({
      where: {
        walletsId: currentWalletItem?.walletsId,
      },
      relations: {
        payer: true,
        recievers: true,
        Wallets: true,
      },
    });

    walletItems.sort((a: any, b: any) => {
      switch (sortType) {
        case "DateAsc":
          return a.date > b.date ? 1 : -1;
        case "DateDesc":
          return a.date < b.date ? 1 : -1;
        case "AmountAsc":
          return a.amount > b.amount ? 1 : -1;
        case "AmountDesc":
          return a.amount < b.amount ? 1 : -1;
        case "TitleAsc":
          return a.name > b.name ? 1 : -1;
        case "TitleDesc":
          return a.name < b.name ? 1 : -1;
        case "PayerAsc":
          return a.payer.name > b.payer.name ? 1 : -1;
        case "PayerDesc":
          return a.payer.name < b.payer.name ? 1 : -1;
        case "CategoryAsc":
          return a.type > b.type ? 1 : -1;
        case "CategoryDesc":
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
  };

  // SHR Done
  const getWalletUsersByWalletId = async (id: string) => {
    let walletUsers = await walletUserRepository.current.find({
      where: {
        walletsId: id,
      },
    });

    console.log("getWalletUsersByWalletId", walletUsers);

    return walletUsers;
  };

  // SHR Done
  const addWallet = async (input: z.infer<typeof WalletSchema>) => {
    console.log("addWallet input", input);
    const validationResult = WalletSchema.safeParse(input);

    if (!validationResult.success) {
      throw new Error("validationResult error");
    }

    const wallet = new Wallets();
    wallet.name = input.name;
    wallet.globalId = input.globalId;
    wallet.description = input.description;
    wallet.currency = input.currency;
    wallet.category = input.category;
    wallet.total = 0;
    wallet.createdAt = new Date();
    wallet.updatedAt = new Date();
    wallet.isSynced = input.isSynced;
    await walletsRepository.current.save(wallet);

    for (const user of input.userList) {
      const walletUser = new WalletUser();
      walletUser.name = user.name;
      walletUser.bilance = 0;
      walletUser.total = 0;
      walletUser.createdAt = new Date();
      walletUser.updatedAt = new Date();
      walletUser.Wallets = wallet;
      await walletUserRepository.current.save(walletUser);
    }

    await listOfTables();

    await saveToStore();

    return wallet;
  };

  // SHR Done
  const addWalletItem = async (input: z.infer<typeof WalletItemSchema>) => {
    const validationResult = WalletItemSchema.safeParse(input);

    if (!validationResult.success) {
      throw new Error("validationResult error");
    }

    const wallet = await walletsRepository.current.findOne({
      where: {
        id: input.walletId,
      },
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const payer = await walletUserRepository.current.findOne({
      where: {
        id: input.payer,
      },
    });

    if (!payer) {
      throw new Error("Payer not found");
    }

    const date = new Date(input.date);
    const tags: string[] = [input.tags || ""];

    const walletItem = new WalletItem();
    walletItem.name = input.name;
    walletItem.tags = tags;
    walletItem.amount = input.amount;
    walletItem.type = input.type;
    walletItem.date = date;
    walletItem.Wallets = wallet;
    walletItem.payer = payer;

    await walletItemsRepository.current.save(walletItem);

    for (const receiver of input.recieversData) {
      const walletUser = await walletUserRepository.current.findOne({
        where: {
          id: receiver.id,
        },
      });

      if (!walletUser) {
        throw new Error("WalletUser not found");
      }

      const recieverData = new RecieverData();
      recieverData.reciever = walletUser;
      recieverData.amount = receiver.cutFromAmount;
      recieverData.WalletItem = walletItem;

      await recieverDataRepository.current.save(recieverData);
    }

    // Update bliance of payer
    let newBilance = 0;
    if (input.type === "expense" || input.type === "moneyTransfer") {
      newBilance += input.amount;
    }
    if (input.type === "income") {
      newBilance -= input.amount;
    }

    payer.bilance += newBilance;
    await walletUserRepository.current.save(payer);

    let newTotal = 0;
    if (input.type === "expense") {
      newTotal += input.amount;
    }
    if (input.type === "income") {
      newTotal -= input.amount;
    }
    // Monney transfer doesnt affect total

    wallet.total += newTotal;
    await walletsRepository.current.save(wallet);

    // Update bliance of recievers
    for (const receiver of input.recieversData) {
      let newBilance = 0;
      let newTotal = 0;

      if (input.type === "expense") {
        newBilance -= receiver.cutFromAmount;
        newTotal += receiver.cutFromAmount;
      }
      if (input.type === "income") {
        newBilance += receiver.cutFromAmount;
        newTotal -= receiver.cutFromAmount;
      }
      if (input.type === "moneyTransfer") {
        newBilance -= receiver.cutFromAmount;
      }

      const walletUser = await walletUserRepository.current.findOne({
        where: {
          id: receiver.id,
        },
      });

      if (!walletUser) {
        throw new Error("WalletUser not found");
      }

      walletUser.bilance += newBilance;
      walletUser.total += newTotal;
      await walletUserRepository.current.save(walletUser);
    }

    await saveToStore();
  };

  // SHR Todo
  const editWalletItem = async (
    id: string,
    input: z.infer<typeof WalletItemSchema>
  ) => {
    // Validate input
    const validationResult = WalletItemSchema.safeParse(input);

    if (!validationResult.success) {
      throw new Error("validationResult error");
    }

    const oldWalletItem = await walletItemsRepository.current.findOne({
      where: {
        id: id,
      },
      relations: {
        payer: true,
        Wallets: true,
        recievers: {
          reciever: true,
        },
      },
    });

    if (!oldWalletItem) {
      throw new Error("WalletItem not found");
    }

    const recieverData = await recieverDataRepository.current.find({
      where: {
        walletItemId: id,
      },
    });

    if (!recieverData) {
      throw new Error("RecieverData not found");
    }

    for (const reciever of recieverData) {
      await recieverDataRepository.current.remove(reciever);
    }

    const date = new Date(input.date);
    const tags: string[] = [input.tags || ""];

    const walletItem = await walletItemsRepository.current.findOne({
      where: {
        id: id,
      },
      relations: {
        payer: true,
        recievers: true,
      },
    });

    if (!walletItem) {
      throw new Error("WalletItem not found");
    }

    const payer = await walletUserRepository.current.findOne({
      where: {
        id: input.payer,
      },
    });

    if (!payer) {
      throw new Error("Payer not found");
    }

    walletItem.name = input.name;
    walletItem.amount = input.amount;
    walletItem.date = date;
    walletItem.tags = tags;
    walletItem.type = input.type;
    walletItem.payer = payer;
    await walletItemsRepository.current.save(walletItem);

    for (const receiver of input.recieversData) {
      const walletUser = await walletUserRepository.current.findOne({
        where: {
          id: receiver.id,
        },
      });

      if (!walletUser) {
        throw new Error("WalletUser not found");
      }

      const recieverData = new RecieverData();
      recieverData.reciever = walletUser;
      recieverData.amount = receiver.cutFromAmount;
      recieverData.WalletItem = walletItem;

      await recieverDataRepository.current.save(recieverData);
    }

    // Remove bilance from old payer
    let oldBalance = 0;
    if (
      oldWalletItem.type === "expense" ||
      oldWalletItem.type === "moneyTransfer"
    ) {
      oldBalance -= oldWalletItem.amount;
    }
    if (oldWalletItem.type === "income") {
      oldBalance += oldWalletItem.amount;
    }

    oldWalletItem.payer.bilance += oldBalance;
    await walletUserRepository.current.save(oldWalletItem.payer);

    // Update bliance of new payer
    let newBalance = 0;
    if (input.type === "expense" || input.type === "moneyTransfer") {
      newBalance += input.amount;
    }
    if (input.type === "income") {
      newBalance -= input.amount;
    }

    payer.bilance += newBalance;
    await walletUserRepository.current.save(payer);

    // Update Wallet Total of payer
    // Remove old total
    let oldTotal = 0;
    if (oldWalletItem.type === "expense") {
      oldTotal -= oldWalletItem.amount;
    }
    if (oldWalletItem.type === "income") {
      oldTotal += oldWalletItem.amount;
    }

    // Add New total
    let newTotal = 0;
    if (input.type === "expense") {
      newTotal += input.amount;
    }
    if (input.type === "income") {
      newTotal -= input.amount;
    }
    // Monney transfer doesnt affect total

    oldWalletItem.Wallets.total =
      oldWalletItem.Wallets.total + oldTotal + newTotal;
    await walletsRepository.current.save(oldWalletItem.Wallets);

    // Remove old bilance from old receivers
    for (const receiver of oldWalletItem.recievers) {
      let oldBalance = 0;
      let oldTotal = 0;
      if (oldWalletItem.type === "expense") {
        oldBalance += receiver.amount;
        oldTotal -= receiver.amount;
      }
      if (oldWalletItem.type === "income") {
        oldBalance -= receiver.amount;
        oldTotal += receiver.amount;
      }
      if (oldWalletItem.type === "moneyTransfer") {
        oldBalance += receiver.amount;
      }

      receiver.reciever.bilance += oldBalance;
      receiver.reciever.total += oldTotal;
      await walletUserRepository.current.save(receiver.reciever);
    }

    // Update bliance of recievers
    for (const receiver of input.recieversData) {
      let newBilance = 0;
      let newTotal = 0;

      if (input.type === "expense") {
        newBilance -= receiver.cutFromAmount;
        newTotal += receiver.cutFromAmount;
      }
      if (input.type === "income") {
        newBilance += receiver.cutFromAmount;
        newTotal -= receiver.cutFromAmount;
      }
      if (input.type === "moneyTransfer") {
        newBilance -= receiver.cutFromAmount;
      }

      const newReceiver = await walletUserRepository.current.findOne({
        where: {
          id: receiver.id,
        },
      });

      if (!newReceiver) {
        throw new Error("WalletUser not found");
      }

      newReceiver.bilance += newBilance;
      newReceiver.total += newTotal;
      await walletUserRepository.current.save(newReceiver);
    }

    await saveToStore();
  };

  // SHR Done
  const editWallet = async (
    id: string,
    input: any // z.infer<typeof WalletSchema>
  ) => {
    console.log("editWallet input", input);
    const validationResult = WalletSchema.safeParse(input);

    if (!validationResult.success) {
      throw new Error("validationResult error");
    }

    const oldWallet = await walletsRepository.current.findOne({
      where: {
        id: id,
      },
      relations: {
        walletUsers: true,
      },
    });

    if (!oldWallet) {
      throw new Error("Wallet not found");
    }

    const wallet = await walletsRepository.current.findOne({
      where: {
        id: id,
      },
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    wallet.name = input.name;
    wallet.description = input.description;
    wallet.currency = input.currency;
    wallet.category = input.category;
    wallet.updatedAt = new Date();
    wallet.isSynced = input.isSynced;
    await walletsRepository.current.save(wallet);

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
    for (const dbUser of oldWallet.walletUsers) {
      if (!input.userList.some((newUser: any) => newUser.id === dbUser.id)) {
        deleteOperations.push(dbUser.id);
      }
    }

    // Insert new wallet users
    if (createOperations.length > 0) {
      for (const operation of createOperations) {
        const walletUser = new WalletUser();
        walletUser.name = operation.name;
        walletUser.bilance = 0;
        walletUser.total = 0;
        walletUser.createdAt = new Date();
        walletUser.updatedAt = new Date();
        walletUser.Wallets = wallet;
        await walletUserRepository.current.save(walletUser);
      }
    }

    // Update existing wallet users
    if (updateOperations.length > 0) {
      for (const operation of updateOperations) {
        const walletUser = await walletUserRepository.current.findOne({
          where: {
            id: operation.id,
          },
        });

        if (!walletUser) {
          throw new Error("WalletUser not found");
        }

        walletUser.name = operation.name;
        await walletUserRepository.current.save(walletUser);
      }
    }

    // Delete wallet users
    if (deleteOperations.length > 0) {
      for (const operation of deleteOperations) {
        const walletUser = await walletUserRepository.current.findOne({
          where: {
            id: operation,
          },
        });

        if (!walletUser) {
          throw new Error("WalletUser not found");
        }

        await walletUserRepository.current.remove(walletUser);
      }
    }

    await saveToStore();

    return id;
  };

  // SHR Todo
  const deleteWalletItemById = async (id: string) => {
    const oldWalletItem = await walletItemsRepository.current.findOne({
      where: {
        id: id,
      },
      relations: {
        payer: true,
        recievers: {
          reciever: true,
        },
        Wallets: true,
      },
    });

    if (!oldWalletItem) {
      throw new Error("WalletItem not found");
    }

    // Remove bilance from old payer
    let oldBalance = 0;
    if (
      oldWalletItem.type === "expense" ||
      oldWalletItem.type === "moneyTransfer"
    ) {
      oldBalance -= oldWalletItem.amount;
    }
    if (oldWalletItem.type === "income") {
      oldBalance += oldWalletItem.amount;
    }

    oldWalletItem.payer.bilance += oldBalance;
    await walletUserRepository.current.save(oldWalletItem.payer);

    // Remove Wallet Total of payer
    // Remove old total and apply new total
    let newTotal = 0;
    if (oldWalletItem.type === "expense") {
      newTotal -= oldWalletItem.amount;
    }
    if (oldWalletItem.type === "income") {
      newTotal += oldWalletItem.amount;
    }
    // Monney transfer doesnt affect total

    oldWalletItem.Wallets.total += newTotal;
    await walletsRepository.current.save(oldWalletItem.Wallets);

    // Remove old bliance from old recievers
    for (const receiver of oldWalletItem.recievers) {
      let oldBilance = 0;
      let oldTotal = 0;
      if (oldWalletItem.type === "expense") {
        oldBilance += receiver.amount;
        oldTotal -= receiver.amount;
      }
      if (oldWalletItem.type === "income") {
        oldBilance -= receiver.amount;
        oldTotal += receiver.amount;
      }
      if (oldWalletItem.type === "moneyTransfer") {
        oldBilance += receiver.amount;
      }

      receiver.reciever.bilance += oldBilance;
      receiver.reciever.total += oldTotal;
      await walletUserRepository.current.save(receiver.reciever);
    }

    // Delete wallet item
    await walletItemsRepository.current.remove(oldWalletItem);

    await saveToStore();
  };

  // SHR Done
  const deleteWalletById = async (id: string) => {
    const wallet = await walletsRepository.current.findOne({
      where: {
        id: id,
      },
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    await walletsRepository.current.remove(wallet);

    await listOfTables();

    await saveToStore();

    // SHR This is workaround to refresh data in app
    return id;
  };

  // SHR TBD
  const getUnsyncedWallets = async () => {
    const wallets = await walletsRepository.current.find({
      where: {
        isSynced: false,
      },
      relations: {
        walletUsers: {
          recieverData: true,
          users: true,
          Wallets: true,
          walletItems: true,
        },
        walletItems: {
          payer: true,
          recievers: true,
          Wallets: true,
        },
      },
    });

    return wallets;
  };

  // SHR TBD
  const markWalletAsSynced = async (input: any) => {
    for (const wallet of input) {
      console.log("wallett", wallet);
      const walletToUpdate = await walletsRepository.current.findOne({
        where: {
          id: wallet.id,
        },
      });

      if (!walletToUpdate) {
        throw new Error("Wallet not found");
      }

      walletToUpdate.isSynced = true;

      await walletsRepository.current.save(walletToUpdate);
    }

    await saveToStore();
  };

  const applyUpdateToLocalDB = async (input: any) => {
    for (const wallet of input) {
      console.log("wallet", wallet);

      const walletToUpdate = await walletsRepository.current.findOne({
        where: {
          globalId: wallet.globalId,
        },
      });

      if (!walletToUpdate) {
        console.log("wallet not found creating new one");
        const walletNew = new Wallets();
        walletNew.globalId = wallet.globalId;
        walletNew.name = wallet.name;
        walletNew.description = wallet.description;
        walletNew.currency = wallet.currency;
        walletNew.category = wallet.category;
        walletNew.total = wallet.total;
        walletNew.createdAt = wallet.createdAt;
        walletNew.updatedAt = wallet.updatedAt;
        walletNew.isSynced = true;
        await walletsRepository.current.save(walletNew);

        for (const user of wallet.walletUsers) {
          const walletUserNew = new WalletUser();
          walletUserNew.name = user.name;
          walletUserNew.bilance = user.bilance;
          walletUserNew.total = user.total;
          walletUserNew.createdAt = user.createdAt;
          walletUserNew.updatedAt = user.updatedAt;
          walletUserNew.Wallets = walletNew;
          await walletUserRepository.current.save(walletUserNew);
        }
      } else {
        console.log("wallet found updating");
      }
    }

    await saveToStore();
  };

  return {
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
