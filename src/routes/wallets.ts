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

    const createdWalletItem = await prisma.walletItem.create({
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

    res.sendStatus(201); // 201 Created - Resource successfully created
  } catch (error) {
    res.sendStatus(500);
  }
});

/*router.put("/:id/get_Wallet", async (req: Request, res: Response) => {
  console.log("get_Wallet");
  try {
    if (false) {
      return res.sendStatus(404);
    }

    if (false) {
      return res.status(400).json({
        error: "Error.",
      });
    }

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (false) {
      return res.sendStatus(404);
    }

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});*/

export default router;
