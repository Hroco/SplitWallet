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
  id: z.string(),
  name: z.string(),
  description: z.string(),
  currency: z.string(),
  category: z.string(),
  userList: z.array(
    z.object({ id: z.string(), name: z.string(), email: z.string().optional() })
  ),
  isSynced: z.boolean(),
  deleted: z.boolean(),
});

const WalletItemSchema = z.object({
  id: z.string(),
  walletId: z.string(),
  name: z.string(),
  amount: z.number(),
  date: z.date(),
  payer: z.string(),
  tags: z.string().optional(),
  recieversData: z.array(
    z.object({
      id: z.string(),
      cutFromAmount: z.number(),
      walletUserId: z.string(),
    })
  ),
  type: z.string(),
  isSynced: z.boolean(),
  deleted: z.boolean(),
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

function isUserInWallet(wallet: any, userId: string) {
  return wallet.walletUsers.some((user: any) => user.id === userId);
}

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
    (window as any).logDB = logDB;

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

  const logDB = () => {
    listOfTables().then((lists) => {
      console.log("DB Debug Output ------------", lists);
    });
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

    const lists = {
      listOfWallets,
      listOfWalletUsers,
      listOfWalletItems,
      listOfRecieverData,
      users,
    };

    //console.log("DB Debug Output ------------", lists);

    return lists;
  };

  const getLocalUser = async () => {
    let users = await userRepository.current.find();
    // console.log("getLocalUser", users);
    if (users.length === 0) {
      // console.log("inserting new user TBD", users);

      const localUser = new User();
      localUser.id = uuidv4();
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
    //console.log("getWalletById TBD");
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

    //console.log("getWalletById", wallet);

    return { wallet };
  };

  // SHR Partially Done
  const getWalletUserByEmailAndWalletId = async (
    email: string,
    walletId: string
  ) => {
    //console.log("getWalletUserByEmailAndWalletId TBD");
    // SHR This should find user by his email and walletId code bellow is for testing

    let walletUser = await walletUserRepository.current.findOne({
      where: {
        walletsId: walletId,
      },
    });

    //console.log("getWalletUserByEmailAndWalletId", walletUser);

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

    /*console.log("getWalletItemsByWalletId", {
      wallet,
      walletItems: wallet?.walletItems,
    });*/

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
    //console.log("addWallet input", input);
    const validationResult = WalletSchema.safeParse(input);

    if (!validationResult.success) {
      throw new Error("validationResult error");
    }

    const wallet = new Wallets();
    wallet.id = input.id;
    wallet.name = input.name;
    wallet.description = input.description;
    wallet.currency = input.currency;
    wallet.category = input.category;
    wallet.total = 0;
    wallet.createdAt = new Date();
    wallet.updatedAt = new Date();
    wallet.isSynced = input.isSynced;
    wallet.deleted = false;
    await walletsRepository.current.save(wallet);

    for (const user of input.userList) {
      const walletUser = new WalletUser();
      walletUser.id = user.id;
      walletUser.name = user.name;
      walletUser.bilance = 0;
      walletUser.total = 0;
      walletUser.createdAt = new Date();
      walletUser.updatedAt = new Date();
      walletUser.Wallets = wallet;
      walletUser.deleted = false;
      await walletUserRepository.current.save(walletUser);
    }

    await listOfTables();

    await saveToStore();

    return wallet;
  };

  // SHR Done
  const addWalletItem = async (input: z.infer<typeof WalletItemSchema>) => {
    console.log("addWalletItem input", input);
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
    walletItem.id = input.id;
    walletItem.name = input.name;
    walletItem.tags = tags;
    walletItem.amount = input.amount;
    walletItem.type = input.type;
    walletItem.date = date;
    walletItem.Wallets = wallet;
    walletItem.payer = payer;
    walletItem.isSynced = input.isSynced;
    walletItem.deleted = false;
    await walletItemsRepository.current.save(walletItem);

    for (const receiver of input.recieversData) {
      const walletUser = await walletUserRepository.current.findOne({
        where: {
          id: receiver.walletUserId,
        },
      });

      if (!walletUser) {
        throw new Error("WalletUser not found");
      }

      const recieverData = new RecieverData();
      recieverData.id = receiver.id;
      recieverData.reciever = walletUser;
      recieverData.amount = receiver.cutFromAmount;
      recieverData.WalletItem = walletItem;
      recieverData.deleted = false;
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
          id: receiver.walletUserId,
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

    return walletItem;
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
    walletItem.deleted = input.deleted;
    await walletItemsRepository.current.save(walletItem);

    for (const receiver of input.recieversData) {
      const walletUser = await walletUserRepository.current.findOne({
        where: {
          id: receiver.walletUserId,
        },
      });

      if (!walletUser) {
        throw new Error("WalletUser not found");
      }

      const recieverData = new RecieverData();
      recieverData.id = receiver.id;
      recieverData.reciever = walletUser;
      recieverData.amount = receiver.cutFromAmount;
      recieverData.WalletItem = walletItem;
      recieverData.deleted = false;
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

    console.log("edit walletItem return value", walletItem);
    return walletItem;
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
    wallet.deleted = input.deleted;
    await walletsRepository.current.save(wallet);

    const createOperations: any[] = [];

    for (const user of input.userList) {
      if (!isUserInWallet(oldWallet, user.id)) {
        createOperations.push({
          id: user.id,
          name: user.name,
        });
      }
    }

    let updateOperations: any[] = [];

    for (const user of input.userList) {
      if (isUserInWallet(oldWallet, user.id)) {
        if (user.delete) {
          updateOperations.push({
            id: user.id,
            name: user.name,
            deleted: user.delete,
          });
        } else {
          updateOperations.push({
            id: user.id,
            name: user.name,
            deleted: false,
          });
        }
      }
    }

    // Insert new wallet users
    if (createOperations.length > 0) {
      for (const operation of createOperations) {
        const walletUser = new WalletUser();
        walletUser.id = operation.id;
        walletUser.name = operation.name;
        walletUser.bilance = 0;
        walletUser.total = 0;
        walletUser.createdAt = new Date();
        walletUser.updatedAt = new Date();
        walletUser.Wallets = wallet;
        walletUser.deleted = false;
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
        walletUser.deleted = operation.deleted;
        await walletUserRepository.current.save(walletUser);
      }
    }

    await saveToStore();

    return id;
  };

  // SHR Todo
  const deleteWalletItemById = async (id: string, options: any) => {
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
    oldWalletItem.deleted = true;
    oldWalletItem.isSynced = options.isSynced;
    await walletItemsRepository.current.save(oldWalletItem);
    //await walletItemsRepository.current.remove(oldWalletItem);

    await saveToStore();

    // SHR This is workaround to refresh data in app
    return id;
  };

  // SHR Done
  const deleteWalletById = async (id: string, options: any) => {
    const wallet = await walletsRepository.current.findOne({
      where: {
        id: id,
      },
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    wallet.deleted = true;
    wallet.isSynced = options.isSynced;
    await walletsRepository.current.save(wallet);
    //await walletsRepository.current.remove(wallet);

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

  const getUnsyncedWalletItems = async () => {
    const walletItems = await walletItemsRepository.current.find({
      where: {
        isSynced: false,
      },
      relations: {
        recievers: true,
        payer: true,
      },
    });

    return walletItems;
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

  const markWalletItemsAsSynced = async (input: any) => {
    for (const walletItem of input) {
      console.log("walletItem", walletItem);
      const walletItemToUpdate = await walletItemsRepository.current.findOne({
        where: {
          id: walletItem.id,
        },
      });

      if (!walletItemToUpdate) {
        throw new Error("Wallet Item not found");
      }

      walletItemToUpdate.isSynced = true;

      await walletItemsRepository.current.save(walletItemToUpdate);
    }

    await saveToStore();
  };

  const applyUpdateToLocalDB = async (input: any) => {
    for (const wallet of input) {
      console.log("wallet", wallet);

      const walletToUpdate = await walletsRepository.current.findOne({
        where: {
          id: wallet.id,
        },
      });

      if (!walletToUpdate) {
        console.log("wallet not found creating new one");
        const walletNew = new Wallets();
        walletNew.id = wallet.id;
        walletNew.name = wallet.name;
        walletNew.description = wallet.description;
        walletNew.currency = wallet.currency;
        walletNew.category = wallet.category;
        walletNew.total = wallet.total;
        walletNew.createdAt = wallet.createdAt;
        walletNew.updatedAt = wallet.updatedAt;
        walletNew.isSynced = true;
        walletNew.deleted = wallet.deleted;
        await walletsRepository.current.save(walletNew);

        for (const user of wallet.walletUsers) {
          const walletUserNew = new WalletUser();
          walletUserNew.id = user.id;
          walletUserNew.name = user.name;
          walletUserNew.bilance = user.bilance;
          walletUserNew.total = user.total;
          walletUserNew.createdAt = user.createdAt;
          walletUserNew.updatedAt = user.updatedAt;
          walletUserNew.Wallets = walletNew;
          walletUserNew.deleted = user.deleted;
          await walletUserRepository.current.save(walletUserNew);
        }

        for (const walletItem of wallet.walletItems) {
          const payer = await walletUserRepository.current.findOne({
            where: {
              id: walletItem.payer,
            },
          });

          if (!payer) {
            throw new Error("Payer not found");
          }

          const walletItemNew = new WalletItem();
          walletItemNew.id = walletItem.id;
          walletItemNew.name = walletItem.name;
          walletItemNew.tags = walletItem.tags;
          walletItemNew.amount = walletItem.amount;
          walletItemNew.type = walletItem.type;
          walletItemNew.date = walletItem.date;
          walletItemNew.Wallets = walletNew;
          walletItemNew.payer = payer;
          walletItemNew.isSynced = true;
          walletItemNew.createdAt = walletItem.createdAt;
          walletItemNew.updatedAt = walletItem.updatedAt;
          walletItemNew.deleted = walletItem.deleted;
          await walletItemsRepository.current.save(walletItemNew);

          for (const receiver of walletItem.recievers) {
            const walletUser = await walletUserRepository.current.findOne({
              where: {
                id: receiver.walletUserId,
              },
            });

            if (!walletUser) {
              throw new Error("WalletUser not found");
            }

            console.log("receiver", receiver);
            console.log("walletItem", walletItem);
            console.log("walletUser", walletUser);

            const recieverData = new RecieverData();
            recieverData.id = receiver.id;
            recieverData.reciever = walletUser;
            recieverData.amount = receiver.amount;
            recieverData.WalletItem = walletItem;
            recieverData.createdAt = receiver.createdAt;
            recieverData.updatedAt = receiver.updatedAt;
            recieverData.deleted = receiver.deleted;
            await recieverDataRepository.current.save(recieverData);
          }
        }
      } else {
        console.log("wallet found updating");

        walletToUpdate.name = wallet.name;
        walletToUpdate.description = wallet.description;
        walletToUpdate.currency = wallet.currency;
        walletToUpdate.category = wallet.category;
        walletToUpdate.total = wallet.total;
        walletToUpdate.createdAt = wallet.createdAt;
        walletToUpdate.updatedAt = wallet.updatedAt;
        walletToUpdate.isSynced = true;
        walletToUpdate.deleted = wallet.deleted;
        await walletsRepository.current.save(walletToUpdate);

        for (const user of wallet.walletUsers) {
          const walletUserToUpdate = await walletUserRepository.current.findOne(
            {
              where: {
                id: user.id,
              },
            }
          );

          if (!walletUserToUpdate) {
            console.log("walletUser not found creating new one");
            const walletUserNew = new WalletUser();
            walletUserNew.id = user.id;
            walletUserNew.name = user.name;
            walletUserNew.bilance = user.bilance;
            walletUserNew.total = user.total;
            walletUserNew.createdAt = user.createdAt;
            walletUserNew.updatedAt = user.updatedAt;
            walletUserNew.Wallets = walletToUpdate;
            walletUserNew.deleted = user.deleted;
            await walletUserRepository.current.save(walletUserNew);
          } else {
            console.log("walletUser found updating");
            walletUserToUpdate.name = user.name;
            walletUserToUpdate.bilance = user.bilance;
            walletUserToUpdate.total = user.total;
            walletUserToUpdate.createdAt = user.createdAt;
            walletUserToUpdate.updatedAt = user.updatedAt;
            walletUserToUpdate.Wallets = walletToUpdate;
            walletUserToUpdate.deleted = user.deleted;
            await walletUserRepository.current.save(walletUserToUpdate);
          }
        }

        for (const walletItem of wallet.walletItems) {
          const walletItemToUpdate =
            await walletItemsRepository.current.findOne({
              where: {
                id: walletItem.id,
              },
            });

          const payer = await walletUserRepository.current.findOne({
            where: {
              id: walletItem.payer,
            },
          });

          if (!payer) {
            throw new Error("Payer not found");
          }

          if (!walletItemToUpdate) {
            console.log("walletItem not found creating new one");
            const walletItemNew = new WalletItem();
            walletItemNew.id = walletItem.id;
            walletItemNew.name = walletItem.name;
            walletItemNew.tags = walletItem.tags;
            walletItemNew.amount = walletItem.amount;
            walletItemNew.type = walletItem.type;
            walletItemNew.date = walletItem.date;
            walletItemNew.Wallets = walletToUpdate;
            walletItemNew.payer = payer;
            walletItemNew.isSynced = true;
            walletItemNew.createdAt = walletItem.createdAt;
            walletItemNew.updatedAt = walletItem.updatedAt;
            walletItemNew.deleted = walletItem.deleted;
            await walletItemsRepository.current.save(walletItemNew);

            for (const receiver of walletItem.recievers) {
              const walletUser = await walletUserRepository.current.findOne({
                where: {
                  id: receiver.walletUserId,
                },
              });

              if (!walletUser) {
                throw new Error("WalletUser not found");
              }

              const recieverData = new RecieverData();
              recieverData.id = receiver.id;
              recieverData.reciever = walletUser;
              recieverData.amount = receiver.amount;
              recieverData.WalletItem = walletItem;
              recieverData.createdAt = receiver.createdAt;
              recieverData.updatedAt = receiver.updatedAt;
              recieverData.deleted = receiver.deleted;
              await recieverDataRepository.current.save(recieverData);
            }
          } else {
            console.log("walletItem found updating");

            walletItemToUpdate.name = walletItem.name;
            walletItemToUpdate.tags = walletItem.tags;
            walletItemToUpdate.amount = walletItem.amount;
            walletItemToUpdate.type = walletItem.type;
            walletItemToUpdate.date = walletItem.date;
            walletItemToUpdate.Wallets = walletToUpdate;
            walletItemToUpdate.payer = payer;
            walletItemToUpdate.isSynced = true;
            walletItemToUpdate.createdAt = walletItem.createdAt;
            walletItemToUpdate.updatedAt = walletItem.updatedAt;
            walletItemToUpdate.deleted = walletItem.deleted;
            await walletItemsRepository.current.save(walletItemToUpdate);

            for (const receiver of walletItem.recievers) {
              const receiverToUpdate =
                await recieverDataRepository.current.findOne({
                  where: {
                    id: receiver.id,
                  },
                });

              const walletUser = await walletUserRepository.current.findOne({
                where: {
                  id: receiver.walletUserId,
                },
              });

              if (!walletUser) {
                throw new Error("WalletUser not found");
              }

              if (!receiverToUpdate) {
                console.log("walletItem not found creating new one");
                const recieverData = new RecieverData();
                recieverData.id = receiver.id;
                recieverData.reciever = walletUser;
                recieverData.amount = receiver.amount;
                recieverData.WalletItem = walletItem;
                recieverData.createdAt = receiver.createdAt;
                recieverData.updatedAt = receiver.updatedAt;
                recieverData.deleted = receiver.deleted;
                await recieverDataRepository.current.save(recieverData);
              } else {
                console.log("walletItem found updating");
                receiverToUpdate.reciever = walletUser;
                receiverToUpdate.amount = receiver.amount;
                receiverToUpdate.WalletItem = walletItem;
                receiverToUpdate.createdAt = receiver.createdAt;
                receiverToUpdate.updatedAt = receiver.updatedAt;
                receiverToUpdate.deleted = receiver.deleted;
                await recieverDataRepository.current.save(receiverToUpdate);
              }
            }
          }
        }
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
    getUnsyncedWalletItems,
    markWalletAsSynced,
    applyUpdateToLocalDB,
    markWalletItemsAsSynced,
  };
};

export default useBrowserBackend;
