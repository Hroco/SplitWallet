import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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
});

export const walletRouter = createTRPCRouter({
  getWalletsWithEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ input: { email }, ctx }) => {
      // console.log("getWalletsWithEmail", email);

      const user = await ctx.prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        // console.log("User not found");
        return;
      }

      // console.log("user.id", user.id);

      // Find wallets associated with the user
      const wallets = await ctx.prisma.wallets.findMany({
        where: { walletUsers: { some: { userId: user.id } } },
      });

      // console.log("wallets", wallets);

      return { wallets };
    }),
  getWalletById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      // console.log("getWalletById", id);

      const wallet = await ctx.prisma.wallets.findUnique({
        where: { id: id },
        include: {
          walletUsers: true,
        },
      });

      if (!wallet) {
        // console.log("Wallet not found");
        return;
      }

      return { wallet };
    }),
  addWallet: publicProcedure
    .input(WalletSchema)
    .mutation(async ({ input, ctx }) => {
      // console.log("addWallet", input);

      const walletUsersToCreate = input.userList.map((userList) => {
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

      // console.log("walletUsersToCreate", walletUsersToCreate);

      await ctx.prisma.wallets.create({
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

      /*const usersToConnect = input.emailList.map((email: string) => ({
        email: email,
      }));

      await ctx.prisma.wallets.create({
        data: {
          name: input.name,
          description: input.description,
          currency: input.currency,
          category: input.category,
          users: {
            connect: usersToConnect,
          },
        },
      });*/
    }),
  addWalletItem: publicProcedure
    .input(WalletItemSchema)
    .mutation(async ({ input, ctx }) => {
      console.log("addWalletItem", input);
      const createdWalletItem = await ctx.prisma.walletItem.create({
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
    }),
  getWalletItemsByWalletId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      console.log("getWalletItemByWalletId", id);

      // Find wallets associated with the user
      const walletItems = await ctx.prisma.walletItem.findMany({
        where: { walletsId: id },
        include: {
          payer: true,
        },
      });

      return { walletItems };
    }),
});
