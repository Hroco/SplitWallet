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

export default function MainItemPage() {
  const router = useRouter();
  console.log("router.query", router.query);
  const { walletId } = router.query;

  useEffect(() => {
    console.log("MainItemPage", walletId);
  }, [walletId]);

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
        {contentData.map((item, index) => (
          <MainItem
            onClick={() => router.push("/")}
            key={index}
            name={item.name}
            description={item.description}
            price={item.price}
            date={item.date}
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
