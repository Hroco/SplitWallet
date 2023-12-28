import { useEffect, useState } from "react";
import useBrowserBackend from "./useBrowserBackend";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const WalletSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  currency: z.string(),
  category: z.string(),
  userList: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().optional(),
      delete: z.boolean().optional(),
    })
  ),
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
  deleted: z.boolean(),
});

export type BackendFunctions = ReturnType<typeof useDBHandler>;

export default function useDBHandler() {
  const {
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
    getUnsyncedWallets,
    getUnsyncedWalletItems,
    markWalletAsSynced,
    applyUpdateToLocalDB,
    markWalletItemsAsSynced,
  } = useBrowserBackend();
  const [walletsList, setWalletsList] = useState<any>(null);
  const [newWallet, setNewWallet] = useState<any>(null);
  const [deletedWalletId, setDeletedWalletId] = useState<any>(null);
  const [editedWalletId, setEditedWalletId] = useState<any>(null);
  const [newWalletItem, setNewWalletItem] = useState<any>(null);
  const [walletId, setWalletId] = useState<string>("");
  const [currentWallet, setCurrentWallet] = useState<any>(null);
  const [currentWalletItems, setCurrentWalletItems] = useState<any>(null);
  const [currentWalletUser, setCurrentWalletUser] = useState<any>(null);
  const [deletedWalletItemId, setDeletedWalletItemId] = useState<any>(null);

  useEffect(() => {
    if (!initialized) return;

    /*(async () => {
      const email = 'samko1311@gmail.com';
      const response = await axios.get(
        `/api/wallets/getWalletsWithEmail/${email}`
        );
        setPostResponse(response.data);
      })();*/
    (async () => {
      // We should sync walelts records in global and local dbs here
      console.log("refreshing");
      await syncWallets();
      // console.log("synced wallets");
      const user = await getLocalUser();
      // console.log("user", user);
      await listOfTables();
      const wallets = await getWalletsWithEmail("samko1311@gmail.com");
      // console.log("wallets", wallets);

      if (wallets === undefined) return;

      const nonDeletedWallets = wallets.filter((item: any) => !item.deleted);
      console.log("wallets", wallets);
      nonDeletedWallets.sort((a: any, b: any) => {
        return a.date > b.date ? 1 : -1;
      });
      setWalletsList(nonDeletedWallets);
    })();
  }, [initialized, newWallet, deletedWalletId, editedWalletId]);

  useEffect(() => {
    if (!initialized) return;

    (async () => {
      await syncWallets();

      const { wallet, walletItems } = await getWalletItemsByWalletId(walletId);

      const walletUser = await getWalletUserByEmailAndWalletId(
        "samko1311@gmail.com",
        walletId
      );

      await listOfTables();

      if (wallet === undefined) return;
      if (walletItems === undefined) return;
      if (walletUser === undefined) return;

      const nonDeletedWalletItems = walletItems.filter(
        (item: any) => !item.deleted
      );

      setCurrentWalletItems(nonDeletedWalletItems as any[]);
      setCurrentWallet(wallet);
      setCurrentWalletUser(walletUser);
    })();
  }, [initialized, walletId, newWalletItem, deletedWalletItemId]);

  const sendAndReturnStatus = async (callback: () => any) => {
    // console.log("sendAndReturnStatus", callback);
    try {
      const res = await callback();

      // console.log('res', res);
      if (res.status === 201 || res.status === 200) {
        // Wallet created successfully on server
        console.log("Wallet created successfully on server");
        return true;
      }
    } catch (error: any) {
      if (error.response.data.state === "online") {
        console.error("error from online server", error);
        throw error;
      }
      console.log("Server is offline");

      return false;
    }
  };

  const syncWallets = async () => {
    // sync wallets here
    console.log("syncWallets TBD");

    // Upload local changes to the server
    const unsyncedWallets = await getUnsyncedWallets();
    const unsyncedWalletItems = await getUnsyncedWalletItems();

    console.log("unsyncedWallets", unsyncedWallets);
    console.log("unsyncedWalletItems", unsyncedWalletItems);

    if (unsyncedWallets.length === 0) {
      console.log("No unsynced wallets");
    } else {
      const isSynced = await sendAndReturnStatus(() =>
        axios.put("/api/wallets/updateWallets/", unsyncedWallets)
      );

      if (isSynced) {
        console.log("markWalletAsSynced");
        await markWalletAsSynced(unsyncedWallets);
      }
      // console.log('isSynced', isSynced);
    }

    if (unsyncedWalletItems.length === 0) {
      console.log("No unsynced wallet Items");
    } else {
      const isSynced = await sendAndReturnStatus(() =>
        axios.put("/api/wallets/updateWalletItems/", unsyncedWalletItems)
      );

      if (isSynced) {
        console.log("markWalletItemsAsSynced");
        await markWalletItemsAsSynced(unsyncedWalletItems);
      }
      // console.log('isSynced', isSynced);
    }

    // Download updates from the server
    console.log("Download updates from the server");
    try {
      // const lastSyncTime = await getLastSyncTime(); // Implement this function to get the last sync timestamp
      // const serverUpdates = await axios.get(`/api/wallets/updates?since=${lastSyncTime}`);
      const email = "samko1311@gmail.com";
      const serverUpdates = await axios.get(
        `/api/wallets/updatesForEmail/${email}`
      );
      console.log("serverUpdates", serverUpdates);
      await applyUpdateToLocalDB(serverUpdates.data.wallets);
      /* for (const update of serverUpdates.data) {
        await applyUpdateToLocalDB(update); // Implement this function to apply updates to your local DB
      }
      await setLastSyncTime(new Date()); // Update the last sync timestamp*/
    } catch (error) {
      console.error("Error fetching updates from server:", error);
    }

    console.log("Sync process completed");
  };

  const addWallet = async (input: z.infer<typeof WalletSchema>) => {
    // We need to check if user is loged in as well and append email to the input ?

    // If user is loged, it should have email in his local account, we should add that email into input then
    // If user is not logged in then jsut create Local wallet probably with unsynced flag ?
    //console.log("addWallet", input);

    console.log("addWallet", input);

    const isOnline = await sendAndReturnStatus(() =>
      axios.post("/api/wallets/addWallet/", input)
    );

    console.log("isOnline", isOnline);
    let newWallet;
    if (isOnline) {
      newWallet = await addWalletLocal({ ...input, isSynced: true });
    } else {
      // Add Wallet to local db with unsynced flag
      newWallet = await addWalletLocal({ ...input, isSynced: false });
    }
    console.log("setting new wallet", newWallet);
    setNewWallet(newWallet);
  };

  const addWalletItem = async (input: z.infer<typeof WalletItemSchema>) => {
    const isOnline = await sendAndReturnStatus(() =>
      axios.post("/api/wallets/addWalletItem/", input)
    );

    console.log("isOnline", isOnline);
    let newWalletItem;
    if (isOnline) {
      newWalletItem = await addWalletItemLocal({ ...input, isSynced: true });
    } else {
      // Add Wallet to local db with unsynced flag
      newWalletItem = await addWalletItemLocal({ ...input, isSynced: false });
    }
    console.log("setting new walletItem", newWalletItem);
    setNewWalletItem(newWalletItem);
  };

  const editWalletItem = async (
    id: string,
    input: any //z.infer<typeof WalletItemSchema>
  ) => {
    await editWalletItemLocal(id, input);
  };

  const editWallet = async (
    id: string,
    input: z.infer<typeof WalletSchema>
  ) => {
    const isOnline = await sendAndReturnStatus(() =>
      axios.put(`/api/wallets/editWallet/${id}`, input)
    );

    console.log("isOnline", isOnline);
    let editedId;
    if (isOnline) {
      editedId = await editWalletLocal(id, { ...input, isSynced: true });
    } else {
      // Add Wallet to local db with unsynced flag
      editedId = await editWalletLocal(id, { ...input, isSynced: false });
    }
    setEditedWalletId(editedId);
  };

  const deleteWalletItemById = async (id: string) => {
    const isOnline = await sendAndReturnStatus(() =>
      axios.delete(`/api/wallets/deleteWalletItemById/${id}`)
    );

    console.log("isOnline", isOnline);
    let deletedId;
    if (isOnline) {
      deletedId = await deleteWalletItemByIdLocal(id, { isSynced: true });
    } else {
      // Add Wallet to local db with unsynced flag
      deletedId = await deleteWalletItemByIdLocal(id, { isSynced: false });
    }
    setDeletedWalletItemId(deletedId);
  };

  const deleteWalletById = async (id: string) => {
    const isOnline = await sendAndReturnStatus(() =>
      axios.delete(`/api/wallets/deleteWalletById/${id}`)
    );

    console.log("isOnline", isOnline);
    let deletedId;
    if (isOnline) {
      deletedId = await deleteWalletByIdLocal(id, { isSynced: true });
    } else {
      // Add Wallet to local db with unsynced flag
      deletedId = await deleteWalletByIdLocal(id, { isSynced: false });
    }
    setDeletedWalletId(deletedId);
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
    syncWallets,
    walletsList,
    newWallet,
    setWalletId,
    currentWallet,
    currentWalletItems,
    currentWalletUser,
    setCurrentWalletItems,
  };
}
