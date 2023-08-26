import React from "react";
import { MainItemDiv, MainItemHR } from "../styles/MainItem.styled";

type MainItemProps = {
  name: string;
  description: string;
  price?: number;
  date?: string;
  onClick?: () => void;
};

export default function MainItem({
  name,
  description,
  price,
  date,
  onClick,
}: MainItemProps) {
  return (
    <>
      <MainItemDiv onClick={onClick}>
        <div>
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
        <div>
          <h2>{price}</h2>
          <p>{date}</p>
        </div>
      </MainItemDiv>
      <MainItemHR />
    </>
  );
}
