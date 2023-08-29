import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import contentData from "~/assets/testContentData";
import MainItem from "~/components/MainItem";
import {
  TopPannel,
  MainContent,
  AddButton,
  BurgerButton,
  BottomPannel,
} from "../../styles/MainItemPage.styled";
import AddIcon from "../../assets/icons/addPlus.svg";
import BurgerIcon from "../../assets/icons/hamburger.svg";
import BackIcon from "../../assets/icons/back.svg";
import { api } from "~/utils/api";

export default function MainItemPage() {
  const router = useRouter();
  const { walletId } = router.query;

  if (walletId == undefined) throw new Error("WalletId is undefined.");
  if (typeof walletId != "string") throw new Error("WalletId is not string.");

  const walletItemsFromServer = api.wallet.getWalletItemsByWalletId.useQuery(
    { id: walletId },
    {
      enabled: true,
    }
  );
  const walletItems = walletItemsFromServer.data?.walletItems;

  console.log(walletItems);

  if (!router.isReady) {
    return null;
  }

  return (
    <>
      <TopPannel>
        <BurgerButton onClick={() => router.push("/")}>
          <Image priority src={BackIcon} alt="add icon" />
        </BurgerButton>
        <h1>Grappe 2023</h1>
        <BurgerButton>
          <Image priority src={BurgerIcon} alt="add icon" />
        </BurgerButton>
      </TopPannel>
      <MainContent>
        {walletItems &&
          walletItems.map((walletItem, index) => (
            <MainItem
              onClick={() => router.push(`/${walletId}/${walletItem.id}/open`)}
              key={index}
              name={walletItem.name}
              description={walletItem.payer.name}
              price={walletItem.amount}
              date={walletItem.date.toISOString()}
            />
          ))}
      </MainContent>
      <BottomPannel>
        <div>
          <p>MY TOTAL</p>
          <h2>267.35</h2>
        </div>
        <AddButton onClick={() => router.push(`/${walletId}/add`)}>
          <Image priority src={AddIcon} alt="add icon" />
        </AddButton>
        <div>
          <p>TOTAL EXPENSE</p>
          <h2>937.35</h2>
        </div>
      </BottomPannel>
    </>
  );
}
