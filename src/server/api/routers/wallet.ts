import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const WalletSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  curency: z.string(),
  category: z.string(),
  emailList: z.array(z.string()),
});

export const walletRouter = createTRPCRouter({
  addWallet: publicProcedure
    .input(WalletSchema)
    .mutation(async ({ input, ctx }) => {
      console.log("addWallet");

      const usersToConnect = input.emailList.map((email: string) => ({
        email: email,
      }));

      await ctx.prisma.wallets.create({
        data: {
          name: input.name,
          description: input.description,
          curency: input.curency,
          category: input.category,
          users: {
            connect: usersToConnect,
          },
        },
      });
    }),
});
