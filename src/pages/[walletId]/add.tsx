import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  TopPannel,
  MainContent,
  BurgerButton,
  MiddlePannel,
  BottomContent,
  ParticipantInputDiv,
} from "../../styles/newWalletItem.styled";
import BackIcon from "../../assets/icons/back.svg";
import CheckedIcon from "../../assets/icons/checked.svg";
import Image from "next/image";
import { api } from "~/utils/api";
import { z } from "zod";
import { useSession } from "next-auth/react";

const ParticipantsSchema = z.array(
  z.object({
    id: z.string(),
    checked: z.boolean(),
    cutFromAmount: z.number(),
  })
);

const OutputParticipantsSchema = z.array(
  z.object({
    id: z.string(),
    cutFromAmount: z.number(),
  })
);

export default function MainItemPage() {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [payerId, setPayerId] = useState<string>("");
  const [mainCheckBox, setMainCheckBox] = useState<boolean>(true);
  const [participants, setParticipants] = useState<
    z.infer<typeof ParticipantsSchema>
  >([]);
  const session = useSession();
  const user = session.data?.user;

  const addWalletItem = api.wallet.addWalletItem.useMutation();

  const router = useRouter();
  const { walletId } = router.query;

  if (walletId == undefined) throw new Error("WalletId is undefined.");
  if (typeof walletId != "string") throw new Error("WalletId is not string.");

  const userWalletsFromServer = api.wallet.getWalletById.useQuery(
    { id: walletId },
    {
      enabled: true,
    }
  );
  const wallet = userWalletsFromServer.data?.wallet;

  useEffect(() => {
    const wallet = userWalletsFromServer.data?.wallet;
    if (wallet == undefined) return;
    const walletUsers = wallet.walletUsers;

    if (participants.length == 0) {
      const newParticipants = [...participants];
      for (let i = 0; i < walletUsers.length; i++) {
        const walletUser = walletUsers[i];
        if (walletUser == undefined) throw new Error("User is undefined.");

        const newItem = {
          id: walletUser.id,
          cutFromAmount: 10,
          checked: true,
        };
        newParticipants[i] = newItem;
      }
      setParticipants(newParticipants);
    }

    //line below is for testing and it should be replaced with user id from seesion
    const currentWalletUser = walletUsers.find(
      (walletUser) => walletUser.userId === "clls52cn30000d7vgfv1jx5el"
    );
    if (currentWalletUser == undefined) throw new Error("User is undefined.");

    if (payerId == "") setPayerId(currentWalletUser.id);
  }, [userWalletsFromServer]);

  if (wallet == undefined) return <h1>Loading</h1>;

  if (!router.isReady) {
    return null;
  }

  function handleAddWalletItem() {
    if (walletId == undefined) throw new Error("WalletId is undefined.");
    if (typeof walletId != "string") throw new Error("WalletId is not string.");

    let participantData: z.infer<typeof OutputParticipantsSchema> = [];

    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      if (!participant) throw new Error("Participant is undefined.");

      if (participant.checked) {
        participantData.push({
          id: participant.id,
          cutFromAmount: participant.cutFromAmount,
        });
      }
    }

    addWalletItem.mutate({
      walletId: walletId,
      name: title,
      amount: amount,
      date: date,
      payer: payerId,
      tags: "Beer",
      recieversData: participantData,
    });

    router.push(`/${walletId}/expenses`);
  }

  function getCutFromAmount(i: number): string {
    if (participants == undefined) return "";
    const output = participants[i];
    if (output == undefined) return "";
    return output.cutFromAmount.toString();
  }

  function setCutFromAmount(i: number, cut: number) {
    const newParticipants = [...participants];
    let newItem = newParticipants[i];

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
    let newItem = newParticipants[i];

    if (newItem == undefined) return;

    newItem.checked = state;
    setParticipants(newParticipants);
  }

  const walletUsers = wallet.walletUsers;

  const participantElements = [];
  for (let i = 0; i < walletUsers.length; i++) {
    const user = walletUsers[i];
    if (user == undefined) throw new Error("User is undefined.");

    let state = getCheckedStatus(i);

    participantElements.push(
      <ParticipantInputDiv key={i}>
        <div>
          <input
            type="checkbox"
            id="name"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setCheckedStatus(i, event.target.checked)
            }
            checked={state}
          />
          <label htmlFor="name">{user.name}</label>
        </div>

        <input
          type="number"
          value={getCutFromAmount(i)}
          onChange={(e) => setCutFromAmount(i, parseInt(e.target.value))}
        />
      </ParticipantInputDiv>
    );
  }

  return (
    <>
      <TopPannel>
        <BurgerButton onClick={() => router.push(`/${walletId}/expenses`)}>
          <Image priority src={BackIcon} alt="add icon" />
        </BurgerButton>
        <h1>New expense</h1>
        <BurgerButton onClick={() => handleAddWalletItem()}>
          <Image priority src={CheckedIcon} alt="add icon" />
        </BurgerButton>
      </TopPannel>
      <MainContent>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={date.toISOString().split("T")[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
        />
        <label htmlFor="payer">Paid by</label>
        <select
          id="payer"
          value={payerId as string}
          onChange={(e) => setPayerId(e.target.value)}
        >
          {walletUsers.map((walletUser, index) => (
            <option key={walletUser.id} value={walletUser.id}>
              {walletUser.name}
            </option>
          ))}
        </select>
      </MainContent>
      <MiddlePannel>
        <input
          type="checkbox"
          id="name"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setMainCheckBox(event.target.checked)
          }
          checked={mainCheckBox}
        />
        <p>For whom</p>
        <button>Advanced</button>
      </MiddlePannel>
      <BottomContent>{participantElements}</BottomContent>
    </>
  );
}
