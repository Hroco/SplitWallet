import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  TopPannel,
  MainContent,
  AddButton,
  BurgerButton,
  BottomPannel,
} from "../../../styles/MainItemPage.styled";
import AddIcon from "../../../assets/icons/addPlus.svg";
import BurgerIcon from "../../../assets/icons/hamburger.svg";
import BackIcon from "../../../assets/icons/back.svg";
import { api } from "~/utils/api";
import Image from "next/image";

export default function MainItemPage() {
  const router = useRouter();
  // console.log("router.query", router.query);
  const { id } = router.query;

  useEffect(() => {
    // console.log("MainItemPage", id);
  }, [id]);

  if (!router.isReady) {
    return null;
  }

  return (
    <>
      <TopPannel>
        <BurgerButton onClick={() => router.push("/")}>
          <Image priority src={BackIcon} alt="add icon" />
        </BurgerButton>
        <h1>Nazov polozky</h1>
        <BurgerButton>Edit</BurgerButton>
      </TopPannel>
      <MainContent>
        <h1>Content</h1>
      </MainContent>
      <BottomPannel>
        <BurgerButton onClick={() => router.push("/")}>
          <Image priority src={BackIcon} alt="add icon" />
          <p>Previouse</p>
        </BurgerButton>
        <BurgerButton rotate={"180"} onClick={() => router.push("/")}>
          <p>Next</p>
          <Image priority src={BackIcon} alt="add icon" />
        </BurgerButton>
      </BottomPannel>
    </>
  );
}
