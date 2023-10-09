import { useState } from 'react';
import useBrowserBackend from './useBrowserBackend';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

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
  type: z.string(),
});

export type BackendFunctions = ReturnType<typeof useDBHandler>;

export default function useDBHandler() {
  const {
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
    addWallet: addWalletLocal,
    addWalletItem: addWalletItemLocal,
    editWalletItem: editWalletItemLocal,
    editWallet: editWalletLocal,
    deleteWalletItemById: deleteWalletItemByIdLocal,
    deleteWalletById: deleteWalletByIdLocal,
    initialized,
  } = useBrowserBackend();

  const addWallet = async (input: z.infer<typeof WalletSchema>) => {
    await addWalletLocal(input);
  };

  const addWalletItem = async (input: z.infer<typeof WalletItemSchema>) => {
    await addWalletItemLocal(input);
  };

  const editWalletItem = async (
    id: string,
    input: z.infer<typeof WalletItemSchema>
  ) => {
    await editWalletItemLocal(id, input);
  };

  const editWallet = async (
    id: string,
    input: any // z.infer<typeof WalletSchema>
  ) => {
    await editWalletLocal(id, input);
  };

  const deleteWalletItemById = async (id: string) => {
    await deleteWalletItemByIdLocal(id);
  };

  const deleteWalletById = async (id: string) => {
    await deleteWalletByIdLocal(id);
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
  };
}
