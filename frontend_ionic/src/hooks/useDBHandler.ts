import { useEffect, useState } from "react";
import useBrowserBackend from "./useBrowserBackend";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const WalletSchema = z.object({
  globalId: z.string(),
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
    markWalletAsSynced,
    applyUpdateToLocalDB,
  } = useBrowserBackend();
  const [walletsList, setWalletsList] = useState<any>(null);
  const [newWallet, setNewWallet] = useState<any>(null);
  const [deletedWalletId, setDeletedWalletId] = useState<any>(null);
  const [editedWalletId, setEditedWalletId] = useState<any>(null);

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
      // console.log("syncing wallets");
      // await syncWallets();
      // console.log("synced wallets");
      const user = await getLocalUser();
      // console.log("user", user);
      await listOfTables();
      const wallets = await getWalletsWithEmail("samko1311@gmail.com");
      // console.log("wallets", wallets);

      if (wallets === undefined) return;

      wallets.sort((a: any, b: any) => {
        return a.date > b.date ? 1 : -1;
      });
      setWalletsList(wallets);
    })();
  }, [initialized, newWallet, deletedWalletId, editedWalletId]);

  const sendAndReturnStatus = async (callback: () => any) => {
    // console.log("sendAndReturnStatus", callback);
    try {
      const res = await callback();

      // console.log('res', res);
      if (res.status === 201 || res.status === 200) {
        // Wallet created successfully on server
        //console.log("Wallet created successfully on server");
        return true;
      }
    } catch (error: any) {
      if (error.response.data.state === "online") {
        console.error("error from online server", error);
        throw error;
      }
      //console.log("Server is offline");

      return false;
    }
  };

  const syncWallets = async () => {
    // sync wallets here
    //console.log("syncWallets TBD");

    // Upload local changes to the server
    const unsyncedWallets = await getUnsyncedWallets();

    //console.log("unsyncedWallets", unsyncedWallets);

    if (unsyncedWallets.length === 0) {
      //console.log("No unsynced wallets");
    } else {
      const isSynced = await sendAndReturnStatus(() =>
        axios.put("/api/wallets/update/", unsyncedWallets)
      );

      if (isSynced) {
        //console.log("markWalletAsSynced");
        await markWalletAsSynced(unsyncedWallets);
      }
      // console.log('isSynced', isSynced);
    }

    // Download updates from the server
    // console.log('Download updates from the server');
    try {
      // const lastSyncTime = await getLastSyncTime(); // Implement this function to get the last sync timestamp
      // const serverUpdates = await axios.get(`/api/wallets/updates?since=${lastSyncTime}`);
      const email = "samko1311@gmail.com";
      const serverUpdates = await axios.get(
        `/api/wallets/updatesForEmail/${email}`
      );
      // console.log('serverUpdates', serverUpdates);
      await applyUpdateToLocalDB(serverUpdates.data.wallets);
      /* for (const update of serverUpdates.data) {
        await applyUpdateToLocalDB(update); // Implement this function to apply updates to your local DB
      }
      await setLastSyncTime(new Date()); // Update the last sync timestamp*/
    } catch (error) {
      console.error("Error fetching updates from server:", error);
    }

    // console.log('Sync process completed');
  };

  const addWallet = async (input: z.infer<typeof WalletSchema>) => {
    // We need to check if user is loged in as well and append email to the input ?

    // If user is loged, it should have email in his local account, we should add that email into input then
    // If user is not logged in then jsut create Local wallet probably with unsynced flag ?
    //console.log("addWallet", input);

    const isOnline = await sendAndReturnStatus(() =>
      axios.post("/api/wallets/addWallet/", input)
    );

    //console.log("isOnline", isOnline);
    let newWallet;
    if (isOnline) {
      newWallet = await addWalletLocal({ ...input, isSynced: true });
    } else {
      // Add Wallet to local db with unsynced flag
      newWallet = await addWalletLocal({ ...input, isSynced: false });
    }
    //console.log("setting new wallet", newWallet);
    setNewWallet(newWallet);
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
    const editedId = await editWalletLocal(id, input);
    setEditedWalletId(editedId);
  };

  const deleteWalletItemById = async (id: string) => {
    await deleteWalletItemByIdLocal(id);
  };

  const deleteWalletById = async (id: string) => {
    const deletedId = await deleteWalletByIdLocal(id);
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
  };
}
