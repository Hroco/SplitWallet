/* eslint-disable import/no-webpack-loader-syntax */
import React, { useEffect, useState } from "react";
import { BurgerButton } from "../styles/buttons.styled";
import { ParticipantInputDiv } from "../styles/newWalletItem.styled";
import { Capacitor } from "@capacitor/core";
import { MiddlePannel, BottomContent } from "../styles/mainContainers.styled";
import { MainContentItem } from "../styles/newWallet.styled";
import {
  Input,
  Select,
  Label,
  IonCheckboxOrange,
} from "../styles/Input.styled";
import BackIcon from "-!svg-react-loader!../assets/icons/back.svg";
import CheckedIcon from "-!svg-react-loader!../assets/icons/checked.svg";
import { z } from "zod";
import { useHistory, useParams } from "react-router-dom";
// import axios from 'axios';
import LoadingScreen from "../components/LoadingScreen";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useDBFunctions } from "../lib/FrontendDBContext";
import { v4 as uuidv4 } from "uuid";

const ParticipantsSchema = z.array(
  z.object({
    id: z.string(),
    checked: z.boolean(),
    cutFromAmount: z.number(),
    walletUserId: z.string(),
  })
);

const OutputParticipantsSchema = z.array(
  z.object({
    id: z.string(),
    cutFromAmount: z.number(),
    walletUserId: z.string(),
  })
);

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

function arraysAreEqual(arr1: any, arr2: any) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
      return false;
    }
  }

  return true;
}

interface RouteParams {
  walletId: string;
}

export default function Add() {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [payerId, setPayerId] = useState<string>("");
  const [type, setType] = useState<string>("expense");
  const [mainCheckBoxMode, setMainCheckBoxMode] = useState<string>("checked");
  const [mainCheckBox, setMainCheckBox] = useState<boolean>(true);
  const [participants, setParticipants] = useState<
    z.infer<typeof ParticipantsSchema>
  >([]);
  // const [postResponse, setPostResponse] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);

  const { walletId } = useParams<{ walletId: string }>();
  // const history = useHistory();
  const history = useHistory();
  const { getWalletById, addWalletItem, initialized } = useDBFunctions();

  if (walletId == undefined) throw new Error("WalletId is undefined.");
  if (typeof walletId != "string") throw new Error("WalletId is not string.");

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
    if (!initialized) return;
    (async () => {
      const { wallet } = await getWalletById(walletId);

      if (wallet == undefined) return;

      setWallet(wallet);
    })();
  }, [initialized]);

  useEffect(() => {
    const numberOfCheckedUsers = participants.filter(
      (participant) => participant.checked === true
    ).length;
    // console.log("numberOfCheckedUsers", numberOfCheckedUsers);
    // console.log("participants", participants);
    if (numberOfCheckedUsers > 0) {
      const newUserAmount = amount / numberOfCheckedUsers;

      // Use map to create a new array with updated amount for checked participants
      const updatedParticipants = participants.map((participant) => {
        if (participant.checked) {
          return {
            ...participant,
            cutFromAmount: newUserAmount,
          };
        } else {
          return {
            ...participant,
            cutFromAmount: 0,
          };
        }
        return participant; // for unchecked participants, keep the original object
      });

      // Update the state with the new array of participants
      if (!arraysAreEqual(updatedParticipants, participants)) {
        // console.log('updatedParticipants', updatedParticipants);
        // console.log('participants', participants);
        setParticipants(updatedParticipants);
      }
    }
  }, [amount, participants]);

  function handleMainCheckBoxClick() {
    //console.log("handleMainCheckBoxClick");
    if (mainCheckBoxMode == "checked") {
      setMainCheckBoxMode("unchecked");
      setParticipants(
        participants.map((participant) => {
          return {
            ...participant,
            checked: false,
          };
        })
      );
    } else if (
      mainCheckBoxMode == "unchecked" ||
      mainCheckBoxMode == "crossed"
    ) {
      setMainCheckBoxMode("checked");
      setParticipants(
        participants.map((participant) => {
          return {
            ...participant,
            checked: true,
          };
        })
      );
    }
  }

  useEffect(() => {
    // update state of main checbox to one of three posible states
    const numberOfCheckedUsers = participants.filter(
      (participant) => participant.checked === true
    ).length;

    if (numberOfCheckedUsers == participants.length)
      setMainCheckBoxMode("checked");
    else if (numberOfCheckedUsers == 0) setMainCheckBoxMode("unchecked");
    else setMainCheckBoxMode("crossed");
  }, [participants]);

  useEffect(() => {
    if (wallet == undefined) return;
    const walletUsers = wallet.walletUsers;

    if (participants.length == 0) {
      const newParticipants = [...participants];
      for (let i = 0; i < walletUsers.length; i++) {
        if (walletUsers[i].deleted) continue;
        const walletUser = walletUsers[i];
        if (walletUser == undefined) throw new Error("User is undefined.");

        const newItem = {
          id: uuidv4(),
          cutFromAmount: 0,
          checked: true,
          walletUserId: walletUser.id,
        };

        //console.log("newItem", newItem);
        newParticipants.push(newItem);
      }
      setParticipants(newParticipants);
    }

    // line below is for testing and it should be replaced with user id from seesion
    /* const currentWalletUser = walletUsers.find(
      (walletUser: any) => walletUser.userId === 'clls52cn30000d7vgfv1jx5el'
    );
    if (currentWalletUser == undefined) throw new Error('User is undefined.');*/

    // if (payerId == '') setPayerId(currentWalletUser.id);

    if (payerId == "") setPayerId(walletUsers[0].id);
  }, [wallet]);

  // if (wallet == undefined) return <LoadingScreen />;

  async function handleAddWalletItem() {
    const numberOfCheckedUsers = participants.filter(
      (participant) => participant.checked === true
    ).length;

    if (numberOfCheckedUsers == 0)
      throw new Error("The amount should concert at least one participant.");
    if (walletId == undefined) throw new Error("WalletId is undefined.");
    if (typeof walletId != "string") throw new Error("WalletId is not string.");

    const participantData: z.infer<typeof OutputParticipantsSchema> = [];

    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      if (!participant) throw new Error("Participant is undefined.");

      if (participant.checked) {
        participantData.push({
          id: participant.id,
          cutFromAmount: participant.cutFromAmount,
          walletUserId: participant.walletUserId,
        });
      }
    }

    const newWalletItem: z.infer<typeof WalletItemSchema> = {
      id: uuidv4(),
      walletId: walletId,
      name: title,
      amount: amount,
      date: date,
      payer: payerId,
      tags: "Beer",
      recieversData: participantData,
      type: type,
      deleted: false,
    };

    /* const testObject = {
      walletId: 'd1dd35a7-0ca8-4963-b045-442b822f1622',
      name: 'Jedlo',
      amount: 50,
      date: new Date(),
      payer: '71e412b0-86ef-45bb-9cc5-f3b6c525beb9',
      tags: 'Beer',
      recieversData: [
        {
          id: '71e412b0-86ef-45bb-9cc5-f3b6c525beb9',
          cutFromAmount: 25,
        },
        {
          id: 'dd493733-79ad-4f34-97d2-fa1f14db1e3a',
          cutFromAmount: 25,
        },
      ],
      type: 'expense',
    };*/

    // axios.post('/api/wallets/addWalletItem/', newWalletItem);
    //console.log("newWalletItem", newWalletItem);
    await addWalletItem(newWalletItem);

    history.push(`/${walletId}/expenses`);
  }

  function getCutFromAmount(i: number): string {
    if (participants == undefined) return "";
    const output = participants[i];
    if (output == undefined) return "";
    return output.cutFromAmount.toString();
  }

  function setCutFromAmount(i: number, cut: number) {
    const newParticipants = [...participants];
    const newItem = newParticipants[i];

    if (newItem == undefined) return;

    newItem.cutFromAmount = cut;
    setParticipants(newParticipants);
  }

  function getCheckedStatus(i: number): boolean {
    if (participants == undefined) return false;
    const output = participants[i];
    if (output == undefined) return false;
    return output.checked;
  }

  function setCheckedStatus(i: number, state: boolean) {
    const newParticipants = [...participants];
    const newItem = newParticipants[i];

    if (newItem == undefined) return;

    newItem.checked = state;
    setParticipants(newParticipants);
  }

  if (wallet == undefined) return <LoadingScreen />;

  const notDeletedwalletUsers = wallet.walletUsers.filter(
    (item: any) => !item.deleted
  );

  const participantElements = [];
  for (let i = 0; i < notDeletedwalletUsers.length; i++) {
    const user = notDeletedwalletUsers[i];
    if (user == undefined) throw new Error("User is undefined.");

    const state = getCheckedStatus(i);

    participantElements.push(
      <ParticipantInputDiv key={i}>
        <div>
          <IonCheckboxOrange
            slot="start"
            checked={state}
            onIonChange={(event: any) =>
              setCheckedStatus(i, event.target.checked)
            }
            data-test-target={"newWalletItemUserCheckbox" + i}
          ></IonCheckboxOrange>
          <IonLabel data-test-target={"newWalletItemUserName" + i}>
            {user.name}
          </IonLabel>
        </div>

        <Input
          type="number"
          value={parseFloat(getCutFromAmount(i)).toFixed(2)}
          onChange={(e) => setCutFromAmount(i, parseInt(e.target.value))}
          data-test-target={"newWalletItemUserValue" + i}
        />
      </ParticipantInputDiv>
    );
  }

  function setHeading() {
    if (type == "expense") return "New expense";
    if (type == "income") return "New income";
    if (type == "moneyTransfer") return "New money transfer";
  }

  function setLabel() {
    if (type == "expense") return "Paid by";
    if (type == "income") return "Recieved by";
    if (type == "moneyTransfer") return "Paid by";
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref={`/${walletId}/expenses`}
            ></IonBackButton>
          </IonButtons>
          <IonTitle>{setHeading()}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              data-test-target="addNewWalletItem"
              onClick={() => handleAddWalletItem()}
            >
              <CheckedIcon />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonSelect
              label="Type"
              placeholder="expense"
              value={type as string}
              onIonChange={(e) => setType(e.detail.value as string)}
              data-test-target="newWalletItemType"
            >
              <IonSelectOption value="expense">Expense</IonSelectOption>
              <IonSelectOption value="income">Income</IonSelectOption>
              <IonSelectOption value="moneyTransfer">
                Money Transfer
              </IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonInput
              label="Title"
              labelPlacement="floating"
              counter={true}
              maxlength={50}
              value={title}
              onIonChange={(e) => setTitle(e.detail.value as string)}
              data-test-target="newWalletItemTitle"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              label="Amount"
              labelPlacement="floating"
              type="number"
              placeholder="0"
              value={amount}
              onIonChange={(e) =>
                setAmount(parseFloat(e.detail.value as string))
              }
              data-test-target="newWalletItemAmount"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              label="Date"
              labelPlacement="floating"
              type="date"
              value={date.toISOString().split("T")[0]}
              onIonChange={(e) => setDate(new Date(e.detail.value as string))}
              data-test-target="newWalletItemDate"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonSelect
              label={setLabel()}
              value={payerId as string}
              onIonChange={(e) => setPayerId(e.detail.value as string)}
              data-test-target="newWalletItemPayer"
            >
              {notDeletedwalletUsers &&
                notDeletedwalletUsers.map((walletUser: any, index: number) => (
                  <IonSelectOption key={walletUser.id} value={walletUser.id}>
                    {walletUser.name}
                  </IonSelectOption>
                ))}
            </IonSelect>
          </IonItem>
        </IonList>
        <MiddlePannel>
          <IonCheckboxOrange
            slot="start"
            indeterminate={mainCheckBoxMode == "crossed"}
            checked={mainCheckBoxMode == "checked"}
            onIonChange={handleMainCheckBoxClick}
          ></IonCheckboxOrange>
          <p>For whom</p>
          <button>Advanced</button>
        </MiddlePannel>
        <BottomContent>{participantElements}</BottomContent>
      </IonContent>
    </IonPage>
  );
}
