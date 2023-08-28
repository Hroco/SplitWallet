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

export const walletRouter = createTRPCRouter({
  getWalletsWithEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ input: { email }, ctx }) => {
      console.log("getWalletsWithEmail", email);

      const user = await ctx.prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        console.log("User not found");
        return;
      }

      console.log("user.id", user.id);

      // Find wallets associated with the user
      const wallets = await ctx.prisma.wallets.findMany({
        where: { walletUsers: { some: { userId: user.id } } },
      });

      console.log("wallets", wallets);

      return { wallets };
    }),
  getWalletById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      console.log("getWalletById", id);

      const wallet = await ctx.prisma.wallets.findUnique({
        where: { id: id },
        include: {
          walletUsers: true,
        },
      });

      if (!wallet) {
        console.log("Wallet not found");
        return;
      }

      console.log("wallet", wallet);

      return { wallet };
    }),
  addWallet: publicProcedure
    .input(WalletSchema)
    .mutation(async ({ input, ctx }) => {
      console.log("addWallet", input);

      const walletUsersToCreate = input.userList.map((userList) => {
        console.log("userList", userList);

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

      console.log("walletUsersToCreate", walletUsersToCreate);

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
});
