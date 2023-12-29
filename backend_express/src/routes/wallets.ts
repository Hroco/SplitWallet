import { Prisma, Wallets } from "@prisma/client";
import express, { Request, Response } from "express";
import { prisma } from "../db";
import { z } from "zod";
const router = express.Router();

const WalletSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  currency: z.string(),
  category: z.string(),
  userList: z.array(
    z.object({ id: z.string(), name: z.string(), email: z.string().optional() })
  ),
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
  walletUsers: z.array(z.unknown()),
  walletItems: z.array(z.unknown()),
  deleted: z.boolean(),
});

const WalletItemSchema = z.object({
  id: z.string(),
  walletId: z.string(),
  name: z.string(),
  amount: z.number(),
  date: z.string().datetime(),
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
  deleted: z.boolean(),
});

const WalletItemSchemaSync = z.object({
  id: z.string(),
  walletId: z.string(),
  name: z.string(),
  amount: z.number(),
  date: z.string().datetime(),
  payer: z.string(),
  tags: z.string().optional(),
  recieversData: z.array(
    z.object({ id: z.string(), cutFromAmount: z.number() })
  ),
  type: z.string(),
});

function isUserInWallet(wallet: any, userId: string) {
  return wallet.walletUsers.some((user: any) => user.id === userId);
}

router.get(
  "/getWalletsWithEmail/:email",
  async (req: Request, res: Response) => {
    console.log("get wallets");
    try {
      const email = req.params.email;

      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return res.sendStatus(404);
      }

      const wallets = await prisma.wallets.findMany({
        where: { walletUsers: { some: { userId: user.id } } },
      });

      res.json({ wallets });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.get("/getWalletById/:id", async (req: Request, res: Response) => {
  console.log("get wallets");
  try {
    const id = req.params.id;

    const wallet = await prisma.wallets.findUnique({
      where: { id: id },
      include: {
        walletUsers: {
          include: {
            users: true,
            WalletItem: true,
            RecieverData: true,
          },
        },
      },
    });

    if (!wallet) {
      return res.sendStatus(404);
    }

    res.json({ wallet });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get(
  "/getWalletUserByEmailAndWalletId/:data",
  async (req: Request, res: Response) => {
    console.log("getWalletUserByEmailAndWalletId");
    try {
      const [email, id] = req.params.data.split(",");

      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return res.sendStatus(404);
      }

      const walletUser = await prisma.walletUser.findFirst({
        where: {
          walletsId: id,
          userId: user.id,
        },
      });

      res.json({ walletUser });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/getWalletItemsByWalletId/:id",
  async (req: Request, res: Response) => {
    console.log("get wallets");
    try {
      const id = req.params.id;
      console.log("getWalletItemByWalletId", id);
      const walletItems = await prisma.walletItem.findMany({
        where: { walletsId: id },
        include: {
          payer: true,
        },
      });

      if (!walletItems) {
        return res.sendStatus(404);
      }

      const wallet = await prisma.wallets.findUnique({
        where: { id: id },
        include: {
          walletUsers: true,
        },
      });

      if (!wallet) {
        return res.sendStatus(404);
      }

      res.json({ wallet, walletItems });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/getWalletItemByWalletItemId/:id",
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      console.log("getWalletItemByWalletItemId", id);
      const walletItem = await prisma.walletItem.findFirst({
        where: { id: id },
        include: {
          payer: true,
          recievers: {
            include: {
              reciever: true, // Include the reciever from RecieverData
            },
          },
        },
      });

      if (!walletItem) {
        return res.sendStatus(404);
      }

      res.json({ walletItem });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/getPrevAndNextWalletItemByWalletItemIdAndSortType/:data",
  async (req: Request, res: Response) => {
    try {
      console.log(
        "getPrevAndNextWalletItemByWalletItemIdAndSortType",
        req.params.data
      );
      const [walletItemId, sortType] = req.params.data.split(",");

      const currentWalletItem = await prisma.walletItem.findFirst({
        where: { id: walletItemId },
      });

      if (!currentWalletItem) {
        return res.sendStatus(404);
      }

      const wallet = await prisma.wallets.findFirst({
        where: { id: currentWalletItem.walletsId },
        include: {
          walletItems: true,
        },
      });

      if (!wallet) {
        return res.sendStatus(404);
      }

      const walletItems = wallet.walletItems;

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

      res.json({ walletItemPrev, walletItemNext });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/getWalletUsersByWalletId/:id",
  async (req: Request, res: Response) => {
    console.log("getWalletUsersByWalletId");
    try {
      const id = req.params.id;
      const walletUsers = await prisma.walletUser.findMany({
        where: { walletsId: id },
      });

      if (!walletUsers) {
        return res.sendStatus(404);
      }

      res.json({ walletUsers });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.post("/addWallet", async (req: Request, res: Response) => {
  try {
    const input = req.body; // Extract required fields from req.body
    const validationResult = WalletSchema.safeParse(input);

    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid input data." });
    }

    const walletUsersToCreate = input.userList.map((userList: any) => {
      // console.log("userList", userList);

      if (!userList.email) {
        return {
          id: userList.id,
          name: userList.name,
        };
      }

      return {
        id: userList.id,
        name: userList.name,
        /*users: {
          connect: {
            email: userList.email,
          },
        },*/
      };
    });

    await prisma.wallets.create({
      data: {
        id: input.id,
        name: input.name,
        description: input.description,
        currency: input.currency,
        category: input.category,
        walletUsers: {
          create: walletUsersToCreate,
        },
      },
    });

    res.sendStatus(201); // 201 Created - Resource successfully created
  } catch (error) {
    console.log(error);
    res.status(500).json({
      state: "online",
      error: "SplitWallet Internal Server Error",
      details: error,
    });
  }
});

router.post("/addWalletItem", async (req: Request, res: Response) => {
  try {
    // Validate input
    const input = req.body; // Extract required fields from req.body
    const validationResult = WalletItemSchema.safeParse(input);
    if (!validationResult.success) {
      console.log(validationResult);
      const customErrors = validationResult.error.issues.map(
        (issue) => issue.message
      );
      const errorMessage = "CHYBA \n" + customErrors.join("\n");
      console.log(errorMessage);
      return res.status(400).json({ error: "Invalid input data." });
    }

    console.log("addWalletItem", input);

    // Create wallet item
    await prisma.walletItem.create({
      data: {
        id: input.id,
        name: input.name,
        amount: input.amount,
        date: input.date,
        type: input.type,
        tags: input.tags ? input.tags.split(",") : [], // Assuming tags is a comma-separated string
        payer: {
          connect: { id: input.payer },
        },
        recievers: {
          create: input.recieversData.map((receiver: any) => ({
            id: receiver.id,
            amount: receiver.cutFromAmount,
            reciever: {
              connect: { id: receiver.walletUserId },
            },
          })),
        },
        Wallets: {
          connect: { id: input.walletId },
        },
      },
    });

    // Update bliance of payer
    const walletUser = await prisma.walletUser.findFirst({
      where: { id: input.payer },
    });

    if (!walletUser) {
      return res.sendStatus(404);
    }

    let newBilance = walletUser.bilance;
    if (input.type === "expense" || input.type === "moneyTransfer") {
      newBilance += input.amount;
    }
    if (input.type === "income") {
      newBilance -= input.amount;
    }

    await prisma.walletUser.update({
      where: { id: input.payer },
      data: {
        bilance: newBilance,
      },
    });

    // Update Wallet Total of payer
    const wallet = await prisma.wallets.findFirst({
      where: { id: input.walletId },
    });

    if (!wallet) {
      return res.sendStatus(404);
    }

    let newTotal = wallet.total;
    if (input.type === "expense") {
      newTotal += input.amount;
    }
    if (input.type === "income") {
      newTotal -= input.amount;
    }
    // Monney transfer doesnt affect total

    await prisma.wallets.update({
      where: { id: input.walletId },
      data: {
        total: newTotal,
      },
    });

    // Update bliance of recievers
    input.recieversData.map(async (receiver: any) => {
      const walletUser = await prisma.walletUser.findFirst({
        where: { id: receiver.walletUserId },
      });

      if (!walletUser) {
        return res.sendStatus(404);
      }

      let newBilance = walletUser.bilance;
      let newTotal = walletUser.total;

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

      // const newBilance = walletUser.bilance - receiver.cutFromAmount;
      // const newTotal = walletUser.total + receiver.cutFromAmount;

      await prisma.walletUser.update({
        where: { id: receiver.walletUserId },
        data: {
          bilance: newBilance,
          total: newTotal,
        },
      });
    });

    res.sendStatus(201); // 201 Created - Resource successfully created
  } catch (error) {
    console.log(error);
    res.status(500).json({
      state: "online",
      error: "SplitWallet Internal Server Error",
      details: error,
    });
  }
});

router.put("/editWalletItem/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log("editWalletItem", id);

    // Validate input
    const input = req.body; // Extract required fields from req.body
    const validationResult = WalletItemSchema.safeParse(input);
    if (!validationResult.success) {
      console.log(validationResult);
      const customErrors = validationResult.error.issues.map(
        (issue) => issue.message
      );
      const errorMessage = "CHYBA \n" + customErrors.join("\n");
      console.log(errorMessage);
      return res.status(400).json({ error: "Invalid input data." });
    }

    const oldWalletItem = await prisma.walletItem.findFirst({
      where: { id: id },
      include: {
        payer: true,
        recievers: {
          include: {
            reciever: true, // Include the reciever from RecieverData
          },
        },
      },
    });

    if (!oldWalletItem) {
      return res.sendStatus(404);
    }

    // Delete old receivers
    await prisma.walletItem.update({
      where: { id: id },
      data: {
        recievers: {
          deleteMany: {},
        },
      },
    });

    // Update wallet item
    await prisma.walletItem.update({
      where: { id: id },
      data: {
        name: input.name,
        amount: input.amount,
        date: input.date,
        tags: input.tags ? input.tags.split(",") : [], // Assuming tags is a comma-separated string
        type: input.type,
        payer: {
          connect: { id: input.payer },
        },
        recievers: {
          create: input.recieversData.map((receiver: any) => ({
            id: receiver.id,
            amount: receiver.cutFromAmount,
            reciever: {
              connect: { id: receiver.walletUserId },
            },
          })),
        },
      },
    });

    // Wallets: {
    //   connect: { id: input.walletId },
    // },

    // Remove bliance from old payer
    const oldWalletUser = await prisma.walletUser.findFirst({
      where: { id: oldWalletItem.payer.id },
    });

    if (!oldWalletUser) {
      return res.sendStatus(404);
    }

    let oldBilance = oldWalletUser.bilance;
    if (
      oldWalletItem.type === "expense" ||
      oldWalletItem.type === "moneyTransfer"
    ) {
      oldBilance -= oldWalletItem.amount;
    }
    if (oldWalletItem.type === "income") {
      oldBilance += oldWalletItem.amount;
    }

    await prisma.walletUser.update({
      where: { id: oldWalletItem.payer.id },
      data: {
        bilance: oldBilance,
      },
    });

    // Update bliance of new payer
    const walletUser = await prisma.walletUser.findFirst({
      where: { id: input.payer },
    });

    if (!walletUser) {
      return res.sendStatus(404);
    }

    let newBilance = walletUser.bilance;
    if (input.type === "expense" || input.type === "moneyTransfer") {
      newBilance += input.amount;
    }
    if (input.type === "income") {
      newBilance -= input.amount;
    }

    await prisma.walletUser.update({
      where: { id: input.payer },
      data: {
        bilance: newBilance,
      },
    });

    // Update Wallet Total of payer
    const wallet = await prisma.wallets.findFirst({
      where: { id: input.walletId },
    });

    if (!wallet) {
      return res.sendStatus(404);
    }

    // Remove old total
    let newTotal = wallet.total;
    if (oldWalletItem.type === "expense") {
      newTotal -= oldWalletItem.amount;
    }
    if (oldWalletItem.type === "income") {
      newTotal += oldWalletItem.amount;
    }
    // Monney transfer doesnt affect total

    // Apply new total
    if (input.type === "expense") {
      newTotal += input.amount;
    }
    if (input.type === "income") {
      newTotal -= input.amount;
    }
    // Monney transfer doesnt affect total

    await prisma.wallets.update({
      where: { id: input.walletId },
      data: {
        total: newTotal,
      },
    });

    // Remove old bliance from old recievers
    for (const receiver of oldWalletItem.recievers) {
      const walletUser = await prisma.walletUser.findFirst({
        where: { id: receiver.reciever.id },
      });

      if (!walletUser) {
        return res.sendStatus(404);
      }

      let oldBilance = walletUser.bilance;
      let oldTotal = walletUser.total;
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

      await prisma.walletUser.update({
        where: { id: receiver.reciever.id },
        data: {
          bilance: oldBilance,
          total: oldTotal,
        },
      });
    }

    // Update bliance of recievers
    for (const receiver of input.recieversData) {
      const walletUser = await prisma.walletUser.findFirst({
        where: { id: receiver.walletUserId },
      });

      if (!walletUser) {
        return res.sendStatus(404);
      }

      let newBilance = walletUser.bilance;
      let newTotal = walletUser.total;

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

      await prisma.walletUser.update({
        where: { id: receiver.id },
        data: {
          bilance: newBilance,
          total: newTotal,
        },
      });
    }

    /* if (false) {
      return res.status(400).json({
        error: "Error.",
      });
    }*/

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/editWallet/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log("editWallet", id);

    // Validate input
    const input = req.body; // Extract required fields from req.body
    const validationResult = WalletSchema.safeParse(input);
    if (!validationResult.success) {
      console.log(validationResult);
      const customErrors = validationResult.error.issues.map(
        (issue) => issue.message
      );
      const errorMessage = "CHYBA \n" + customErrors.join("\n");
      console.log(errorMessage);
      return res.status(400).json({ error: "Invalid input data." });
    }

    const oldWallet = await prisma.wallets.findFirst({
      where: { id: id },
      include: {
        walletUsers: true,
      },
    });

    if (!oldWallet) {
      return res.sendStatus(404);
    }

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
            where: { id: user.id },
            data: {
              name: user.name,
              deleted: user.delete,
            },
          });
        } else {
          updateOperations.push({
            where: { id: user.id },
            data: {
              name: user.name,
            },
          });
        }
      }
    }

    // Update wallet
    await prisma.wallets.update({
      where: { id: id },
      data: {
        name: input.name,
        description: input.description,
        currency: input.currency,
        category: input.category,
        walletUsers: {
          ...(createOperations.length > 0 ? { create: createOperations } : {}),
          ...(updateOperations.length > 0 ? { update: updateOperations } : {}),
        },
      },
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updateWallets/", async (req: Request, res: Response) => {
  try {
    console.log("updateWallets");

    // Validate input
    const input = req.body; // Extract required fields from req.body
    // console.log("update input", input);

    for (const wallet of input) {
      // console.log("wallett", wallet);

      const validationResult = WalletSchemaSync.safeParse(wallet);
      if (!validationResult.success) {
        console.log(validationResult);
        const customErrors = validationResult.error.issues.map(
          (issue) => issue.message
        );
        const errorMessage = "CHYBA \n" + customErrors.join("\n");
        console.log(errorMessage);
        return res.status(400).json({ error: "Invalid input data." });
      }

      const oldWallet = await prisma.wallets.findFirst({
        where: { id: wallet.id },
        include: {
          walletUsers: true,
        },
      });

      if (!oldWallet) {
        // Create wallet
        console.log("create wallet that was created offline");
        const walletUsersToCreate = wallet.walletUsers.map((userList: any) => {
          // console.log("userList", userList);

          if (!userList.email) {
            return {
              name: userList.name,
            };
          }

          return {
            name: userList.name,
            /*users: {
              connect: {
                email: userList.email,
              },
            },*/
          };
        });

        await prisma.wallets.create({
          data: {
            id: wallet.id,
            name: wallet.name,
            description: wallet.description,
            currency: wallet.currency,
            category: wallet.category,
            walletUsers: {
              create: walletUsersToCreate,
            },
          },
        });

        res.sendStatus(200);
      } else {
        // Update wallet
        console.log("update wallet that was updated offline TBD");

        res.sendStatus(200);
      }
    }

    /*const oldWallet = await prisma.wallets.findFirst({
      where: { id: id },
      include: {
        walletUsers: true,
      },
    });

    if (!oldWallet) {
      return res.sendStatus(404);
    }

    const createOperations: any[] = [];

    for (const user of input.userList) {
      if (user.id == null) {
        createOperations.push({
          name: user.name,
        });
      }
    }

    let updateOperations: any[] = [];

    for (const user of input.userList) {
      if (user.id != null) {
        const existingItem = oldWallet.walletUsers.find(
          (dbItem) => dbItem.id === user.id
        );

        if (!existingItem) {
          // Item no longer exists in the walletUsers array, mark it for deletion
          updateOperations.push({
            where: { id: user.id },
            delete: true,
          });
        }

        updateOperations.push({
          where: { id: user.id },
          data: {
            name: user.name,
          },
        });
      }
    }

    if (updateOperations) {
      updateOperations = updateOperations.filter((op: any) => !op.delete);
    }

    // Determine items to delete
    const itemsToDelete = oldWallet.walletUsers
      .filter(
        (dbUser) =>
          !input.userList.some((newUser: any) => newUser.id === dbUser.id)
      )
      .map((dbUser) => ({ id: dbUser.id }));

    // Update wallet
    await prisma.wallets.update({
      where: { id: id },
      data: {
        name: input.name,
        description: input.description,
        currency: input.currency,
        category: input.category,
        walletUsers: {
          ...(createOperations.length > 0 ? { create: createOperations } : {}),
          ...(updateOperations.length > 0 ? { update: updateOperations } : {}),
          ...(itemsToDelete.length > 0 ? { delete: itemsToDelete } : {}),
        },
      },
    });
*/
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updateWalletItems/", async (req: Request, res: Response) => {
  try {
    console.log("updateWalletItems");

    // Validate input
    const input = req.body; // Extract required fields from req.body
    // console.log("update input", input);

    for (const walletItem of input) {
      // console.log("wallett", wallet);

      const validationResult = WalletItemSchemaSync.safeParse(walletItem);
      if (!validationResult.success) {
        console.log(validationResult);
        const customErrors = validationResult.error.issues.map(
          (issue) => issue.message
        );
        const errorMessage = "CHYBA \n" + customErrors.join("\n");
        console.log(errorMessage);
        return res.status(400).json({ error: "Invalid input data." });
      }

      const oldWalletItem = await prisma.walletItem.findFirst({
        where: { id: walletItem.id },
        include: {
          recievers: true,
        },
      });

      if (!oldWalletItem) {
        // Create wallet
        console.log("create walletItem that was created offline");

        await prisma.walletItem.create({
          data: {
            id: walletItem.id,
            name: walletItem.name,
            amount: walletItem.amount,
            date: walletItem.date,
            type: walletItem.type,
            tags: walletItem.tags ? walletItem.tags.split(",") : [], // Assuming tags is a comma-separated string
            payer: {
              connect: { id: walletItem.payer },
            },
            recievers: {
              create: walletItem.recieversData.map((receiver: any) => ({
                id: receiver.id,
                amount: receiver.cutFromAmount,
                reciever: {
                  connect: { id: receiver.walletUserId },
                },
              })),
            },
            Wallets: {
              connect: { id: walletItem.walletId },
            },
          },
        });

        res.sendStatus(200);
      } else {
        // Update wallet
        console.log("update walletItem that was updated offline TBD");

        res.sendStatus(200);
      }
    }

    /*const oldWallet = await prisma.wallets.findFirst({
      where: { id: id },
      include: {
        walletUsers: true,
      },
    });

    if (!oldWallet) {
      return res.sendStatus(404);
    }

    const createOperations: any[] = [];

    for (const user of input.userList) {
      if (user.id == null) {
        createOperations.push({
          name: user.name,
        });
      }
    }

    let updateOperations: any[] = [];

    for (const user of input.userList) {
      if (user.id != null) {
        const existingItem = oldWallet.walletUsers.find(
          (dbItem) => dbItem.id === user.id
        );

        if (!existingItem) {
          // Item no longer exists in the walletUsers array, mark it for deletion
          updateOperations.push({
            where: { id: user.id },
            delete: true,
          });
        }

        updateOperations.push({
          where: { id: user.id },
          data: {
            name: user.name,
          },
        });
      }
    }

    if (updateOperations) {
      updateOperations = updateOperations.filter((op: any) => !op.delete);
    }

    // Determine items to delete
    const itemsToDelete = oldWallet.walletUsers
      .filter(
        (dbUser) =>
          !input.userList.some((newUser: any) => newUser.id === dbUser.id)
      )
      .map((dbUser) => ({ id: dbUser.id }));

    // Update wallet
    await prisma.wallets.update({
      where: { id: id },
      data: {
        name: input.name,
        description: input.description,
        currency: input.currency,
        category: input.category,
        walletUsers: {
          ...(createOperations.length > 0 ? { create: createOperations } : {}),
          ...(updateOperations.length > 0 ? { update: updateOperations } : {}),
          ...(itemsToDelete.length > 0 ? { delete: itemsToDelete } : {}),
        },
      },
    });
*/
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/updatesForEmail/:email", async (req: Request, res: Response) => {
  console.log("updatesForEmail TBD");
  try {
    const email = req.params.email;
    console.log("email", email);
    /*const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.sendStatus(404);
    }

    const wallets = await prisma.wallets.findMany({
      where: { walletUsers: { some: { userId: user.id } } },
    });*/

    const wallets = await prisma.wallets.findMany({
      include: {
        walletUsers: true,
        walletItems: {
          include: {
            recievers: true, // Include the reciever from RecieverData
          },
        },
      },
    });

    res.json({ wallets });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.delete(
  "/deleteWalletItemById/:id",
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const oldWalletItem = await prisma.walletItem.findFirst({
        where: { id: id },
        include: {
          payer: true,
          recievers: {
            include: {
              reciever: true, // Include the reciever from RecieverData
            },
          },
        },
      });

      if (!oldWalletItem) {
        return res.sendStatus(404);
      }

      // Remove bliance from old payer
      const oldWalletUser = await prisma.walletUser.findFirst({
        where: { id: oldWalletItem.payer.id },
      });

      if (!oldWalletUser) {
        return res.sendStatus(404);
      }

      let oldBilance = oldWalletUser.bilance;
      if (
        oldWalletItem.type === "expense" ||
        oldWalletItem.type === "moneyTransfer"
      ) {
        oldBilance -= oldWalletItem.amount;
      }
      if (oldWalletItem.type === "income") {
        oldBilance += oldWalletItem.amount;
      }

      await prisma.walletUser.update({
        where: { id: oldWalletItem.payer.id },
        data: {
          bilance: oldBilance,
        },
      });

      // Remove Wallet Total of payer
      const wallet = await prisma.wallets.findFirst({
        where: { id: oldWalletItem.walletsId },
      });

      if (!wallet) {
        return res.sendStatus(404);
      }

      // Remove old total and apply new total
      let newTotal = wallet.total;
      if (oldWalletItem.type === "expense") {
        newTotal -= oldWalletItem.amount;
      }
      if (oldWalletItem.type === "income") {
        newTotal += oldWalletItem.amount;
      }
      // Monney transfer doesnt affect total

      await prisma.wallets.update({
        where: { id: oldWalletItem.walletsId },
        data: {
          total: newTotal,
        },
      });

      // Remove old bliance from old recievers
      for (const receiver of oldWalletItem.recievers) {
        const walletUser = await prisma.walletUser.findFirst({
          where: { id: receiver.reciever.id },
        });

        if (!walletUser) {
          return res.sendStatus(404);
        }

        let oldBilance = walletUser.bilance;
        let oldTotal = walletUser.total;
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

        await prisma.walletUser.update({
          where: { id: receiver.reciever.id },
          data: {
            bilance: oldBilance,
            total: oldTotal,
          },
        });
      }

      await prisma.walletItem.update({
        where: { id: id },
        data: {
          deleted: true,
        },
      });

      /*await prisma.walletItem.delete({
        where: { id: id },
      });*/

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

router.delete("/deleteWalletById/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const wallet = await prisma.wallets.findUnique({
      where: { id: id },
      include: {
        walletUsers: true,
      },
    });

    if (!wallet) {
      return res.sendStatus(404);
    }

    await prisma.wallets.update({
      where: { id: id },
      data: {
        deleted: true,
      },
    });

    /*await prisma.wallets.delete({
      where: { id: id },
    });*/

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
