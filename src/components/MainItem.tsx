import React from "react";
import { MainItemDiv, MainItemHR } from "../styles/MainItem.styled";

type MainItemProps = {
  name: string;
  description: string;
};

export default function MainItem({ name, description }: MainItemProps) {
  return (
    <>
      <MainItemDiv>
        <h2>{name}</h2>
        <p>{description}</p>
      </MainItemDiv>
      <MainItemHR />
    </>
  );
}
