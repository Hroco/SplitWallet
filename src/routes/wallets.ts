import { Prisma } from "@prisma/client";
import express, { Request, Response } from "express";
import { prisma } from "../db";
import { z } from "zod";
const router = express.Router();

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
  date: z.string().datetime(),
  payer: z.string(),
  tags: z.string().optional(),
  recieversData: z.array(
    z.object({ id: z.string(), cutFromAmount: z.number() })
  ),
});

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
        walletUsers: true,
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
          name: userList.name,
        };
      }

      return {
        name: userList.name,
        users: {
          connect: {
            email: userList.email,
          },
        },
      };
    });

    await prisma.wallets.create({
      data: {
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
    res.sendStatus(500);
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

    // Create wallet item
    await prisma.walletItem.create({
      data: {
        name: input.name,
        amount: input.amount,
        date: input.date,
        tags: input.tags ? input.tags.split(",") : [], // Assuming tags is a comma-separated string
        payer: {
          connect: { id: input.payer },
        },
        recievers: {
          create: input.recieversData.map((receiver: any) => ({
            amount: receiver.cutFromAmount,
            reciever: {
              connect: { id: receiver.id },
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

    const newBilance = walletUser.bilance + input.amount;

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

    const newTotal = wallet.total + input.amount;

    await prisma.wallets.update({
      where: { id: input.walletId },
      data: {
        total: newTotal,
      },
    });

    // Update bliance of recievers
    input.recieversData.map(async (receiver: any) => {
      const walletUser = await prisma.walletUser.findFirst({
        where: { id: receiver.id },
      });

      if (!walletUser) {
        return res.sendStatus(404);
      }

      const newBilance = walletUser.bilance - receiver.cutFromAmount;
      const newTotal = walletUser.total + receiver.cutFromAmount;

      await prisma.walletUser.update({
        where: { id: receiver.id },
        data: {
          bilance: newBilance,
          total: newTotal,
        },
      });
    });

    res.sendStatus(201); // 201 Created - Resource successfully created
  } catch (error) {
    res.sendStatus(500);
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

    // Create wallet item
    await prisma.walletItem.update({
      where: { id: id },
      data: {
        name: input.name,
        amount: input.amount,
        date: input.date,
        tags: input.tags ? input.tags.split(",") : [], // Assuming tags is a comma-separated string
        payer: {
          connect: { id: input.payer },
        },
        recievers: {
          create: input.recieversData.map((receiver: any) => ({
            amount: receiver.cutFromAmount,
            reciever: {
              connect: { id: receiver.id },
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

    const oldBilance = oldWalletUser.bilance - input.amount;

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

    const newBilance = walletUser.bilance + input.amount;

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

    // Remove old total and apply new total
    const newTotal = wallet.total - oldWalletItem.amount + input.amount;

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

      const oldBilance = walletUser.bilance + receiver.amount;
      const oldTotal = walletUser.total - receiver.amount;

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
        where: { id: receiver.id },
      });

      if (!walletUser) {
        return res.sendStatus(404);
      }

      const newBilance = walletUser.bilance - receiver.cutFromAmount;
      const newTotal = walletUser.total + receiver.cutFromAmount;

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

    await prisma.wallets.delete({
      where: { id: id },
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
