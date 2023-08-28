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

export default function MainItemPage() {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [payer, setPayer] = useState<string>("");

  const router = useRouter();
  console.log("router.query", router.query);
  const { walletId } = router.query;

  console.log("walletId", walletId);

  if (walletId == undefined) throw new Error("WalletId is undefined.");
  if (typeof walletId != "string") throw new Error("WalletId is not string.");

  const userWalletsFromServer = api.wallet.getWalletById.useQuery(
    { id: walletId },
    {
      enabled: true,
    }
  );
  const wallet = userWalletsFromServer.data?.wallet;

  console.log("wallet", wallet);

  if (wallet == undefined) return <h1>Loading</h1>;

  if (!router.isReady) {
    return null;
  }

  function handleAddWalletItem() {
    console.log("add wallet item");
  }

  const participantElements = [];
  for (let i = 0; i < wallet?.walletUsers.length; i++) {
    const user = wallet?.walletUsers[i];
    console.log("wallet?.walletUsers", wallet?.walletUsers);
    if (user == undefined) throw new Error("User is undefined.");

    participantElements.push(
      <ParticipantInputDiv>
        <div>
          <input type="checkbox" id="name" checked />
          <label htmlFor="name">{user.name}</label>
        </div>

        <input type="number" value="0" />
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
          onChange={(e) => setAmount(e.target.value)}
        />
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label htmlFor="payer">Paid by</label>
        <select
          id="payer"
          value={payer as string}
          onChange={(e) => setPayer(e.target.value)}
        >
          <option value="samo">Samo</option>
          <option value="matus">Matus</option>
          <option value="jakub">Jakub</option>
        </select>
      </MainContent>
      <MiddlePannel>
        <input type="checkbox" id="name" checked />
        <p>For whom</p>
        <button>Advanced</button>
      </MiddlePannel>
      <BottomContent>{participantElements}</BottomContent>
    </>
  );
}
