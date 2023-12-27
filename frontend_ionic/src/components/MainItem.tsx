import React from "react";
import { MainItemDiv, MainItemHR } from "../styles/MainItem.styled";

type MainItemProps = {
  name: string;
  description?: string;
  price?: number;
  date?: string;
  onClick?: () => void;
  cypressButtonId?: string;
  cypressNameId?: string;
  cypressDescriptionId?: string;
};

export default function MainItem({
  name,
  description,
  price,
  date,
  onClick,
  cypressButtonId,
  cypressNameId,
  cypressDescriptionId,
}: MainItemProps) {
  // console.log(name, description, price, date);

  if (description == "") description = "No description";

  return (
    <>
      <MainItemDiv onClick={onClick} data-test-target={cypressButtonId}>
        <div>
          <h2 data-test-target={cypressNameId}>{name}</h2>
          <p data-test-target={cypressDescriptionId}>{description}</p>
        </div>
        <div>
          <h2>{price && "€" + price.toFixed(2)}</h2>
          <p>{date}</p>
        </div>
      </MainItemDiv>
      <MainItemHR />
    </>
  );
}
