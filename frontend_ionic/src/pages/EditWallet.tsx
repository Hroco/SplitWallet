/* eslint-disable import/no-webpack-loader-syntax */
import React, { useEffect, useState } from "react";
import { z } from "zod";
import {
  ParticipantInputDiv,
  MainContentItem,
} from "../styles/newWallet.styled";
import { CategoryButton } from "../styles/buttons.styled";
import {
  MiddlePannel,
  BottomContent,
  Navbar,
} from "../styles/mainContainers.styled";
import { Input, Select, Label } from "../styles/Input.styled";
import BackIcon from "-!svg-react-loader!../assets/icons/back.svg";
import CheckedIcon from "-!svg-react-loader!../assets/icons/checked.svg";
import { useHistory, useParams } from "react-router-dom";
// import axios from 'axios';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { checkmarkOutline } from "ionicons/icons";
import { useDBFunctions } from "../lib/FrontendDBContext";
import { v4 as uuidv4 } from "uuid";

const UserListSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    emailList: z.string().optional(),
    canBeDeleted: z.boolean(),
    deleted: z.boolean().optional(),
  })
);

const OutputUserListSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().optional(),
    deleted: z.boolean().optional(),
  })
);

// const ParticipantsSchema = z.array(z.string());

export default function EditWallet() {
  const history = useHistory();
  const { walletId } = useParams<{ walletId: string }>();
  const [title, setTitle] = useState<string>("");
  const [decription, setDecription] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [participants, setParticipants] = useState<
    z.infer<typeof UserListSchema>
  >([]);
  // const [postResponse, setPostResponse] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const { getWalletById, editWallet, initialized } = useDBFunctions();

  useEffect(() => {
    if (!initialized) return;
    (async () => {
      const { wallet } = await getWalletById(walletId || "");

      if (wallet == undefined) return;

      setWallet(wallet);
    })();
  }, [initialized]);

  /* useEffect(() => {
    (async () => {
      const id = walletId;
      const response = await axios.get(`/api/wallets/getWalletById/${id}`);
      console.log('response', response);
      setPostResponse(response.data);
    })();
  }, []);

  useEffect(() => {
    const { wallet } = postResponse || {};
    setWallet(wallet);
  }, [postResponse]);*/

  useEffect(() => {
    console.log("wallet", wallet);
    if (wallet == undefined) return;
    setTitle(wallet.name);
    setDecription(wallet.description);
    setCurrency(wallet.currency);
    setCategory(wallet.category);
    console.log("participants", participants);

    const walletUsers = wallet.walletUsers;

    if (participants.length == 0) {
      const newParticipants = [...participants];
      for (let i = 0; i < walletUsers.length; i++) {
        if (walletUsers[i].deleted) continue;

        const walletUser = walletUsers[i];
        if (walletUser == undefined) throw new Error("User is undefined.");
        console.log("walletUser", walletUser);
        const user = walletUser.users;
        const walletItems = walletUser.walletItems;
        const recieverData = walletUser.recieverData;
        console.log("user", user);
        console.log("walletItems", walletItems);
        console.log("recieverData", recieverData);

        const canBeDeleted =
          walletItems.length == 0 && recieverData.length == 0;

        if (user == undefined) {
          const newItem = {
            id: walletUser.id,
            name: walletUser.name,
            canBeDeleted: canBeDeleted,
            deleted: walletUser.deleted,
          };
          newParticipants.push(newItem);
        } else {
          const email = user.email;
          const newItem = {
            id: walletUser.id,
            name: walletUser.name,
            emailList: email,
            canBeDeleted: canBeDeleted,
            deleted: walletUser.deleted,
          };
          newParticipants[i] = newItem;
        }
      }
      setParticipants(newParticipants);
    }
  }, [wallet]);

  async function handleAddWallet() {
    const userList: z.infer<typeof OutputUserListSchema> = participants.map(
      (item, index) => {
        if (index == 0) {
          return {
            id: item.id,
            name: item.name,
            email: "samko1311@gmail.com",
            deleted: item.deleted,
          };
        }
        return { id: item.id, name: item.name, delete: item.deleted };
      }
    );

    const output = {
      id: walletId,
      name: title,
      description: decription,
      currency: currency,
      category: category,
      userList: userList,
      deleted: false,
    };

    await editWallet(walletId || "", output);

    history.push("/");
  }

  function getName(i: number): string {
    if (participants == undefined) return "";
    const output = participants[i];
    if (output == undefined) return "";
    return output.name;
  }

  function setName(i: number, name: string) {
    const newParticipants = [...participants];
    let newParticipant = newParticipants[i];
    if (newParticipant == undefined) {
      newParticipant = { id: uuidv4(), name: "", canBeDeleted: true };
      newParticipants.push(newParticipant);
    }
    newParticipants[i].name = name;
    setParticipants(newParticipants);
  }

  function deleteUser(i: number) {
    const newParticipants = [...participants];
    if (i >= 0 && i < newParticipants.length) {
      if (!newParticipants[i].canBeDeleted) {
        console.error("Cannot delete this user because it is in one of items.");
        return;
      }
      //newParticipants.splice(i, 1);
      newParticipants[i] = { ...newParticipants[i], deleted: true };
      setParticipants(newParticipants);
    } else {
      console.error("Invalid index");
    }
  }

  const participantElements = [];
  console.log("participants", participants);
  for (let i = 0; i < participants.length + 1; i++) {
    if (participants[i] != undefined && participants[i].deleted) continue;
    participantElements.push(
      <MainContentItem>
        <ParticipantInputDiv>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={getName(i)}
              onChange={(e) => setName(i, e.target.value)}
            />
          </div>
          {getName(i) != "" && (
            <button onClick={() => deleteUser(i)}>Delete</button>
          )}
        </ParticipantInputDiv>
      </MainContentItem>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>Edit Wallet</IonTitle>
          <IonButtons slot="end">
            <IonButton size="large" onClick={() => handleAddWallet()}>
              <IonIcon icon={checkmarkOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonInput
              label="Title"
              labelPlacement="floating"
              counter={true}
              maxlength={50}
              value={title}
              onIonChange={(e) => setTitle(e.detail.value as string)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              label="Description"
              labelPlacement="floating"
              counter={true}
              maxlength={500}
              value={decription}
              onIonChange={(e) => setDecription(e.detail.value as string)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonSelect
              label="Currency"
              placeholder="eur"
              value={currency as string}
              onIonChange={(e) => setCurrency(e.detail.value as string)}
            >
              <IonSelectOption value="eur">Eur</IonSelectOption>
              <IonSelectOption value="usd">Usd</IonSelectOption>
              <IonSelectOption value="czk">Czech Koruna</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <p>
              Specify the curency that will be used to balance the splitwallet.
              Other curencies can be used for expenses.
            </p>
          </IonItem>
          <IonItem>
            <p>Category</p>
            <div>
              <CategoryButton
                data-clicked-state={category == "trip"}
                onClick={() => setCategory("trip")}
              >
                Trip
              </CategoryButton>
              <CategoryButton
                data-clicked-state={category == "sharedHouse"}
                onClick={() => setCategory("sharedHouse")}
              >
                Shared house
              </CategoryButton>
              <CategoryButton
                data-clicked-state={category == "couple"}
                onClick={() => setCategory("couple")}
              >
                Couple
              </CategoryButton>
              <CategoryButton
                data-clicked-state={category == "event"}
                onClick={() => setCategory("event")}
              >
                Event
              </CategoryButton>
              <CategoryButton
                data-clicked-state={category == "project"}
                onClick={() => setCategory("project")}
              >
                Project
              </CategoryButton>
              <CategoryButton
                data-clicked-state={category == "other"}
                onClick={() => setCategory("other")}
              >
                Other
              </CategoryButton>
            </div>
          </IonItem>
        </IonList>
        <MiddlePannel>
          <p>Participants ( x / 50 )</p>
        </MiddlePannel>
        <BottomContent>{participantElements}</BottomContent>
      </IonContent>
    </IonPage>
  );
}
