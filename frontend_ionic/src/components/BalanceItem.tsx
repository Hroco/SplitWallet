import React from "react";
import {
  BalanceItemDiv,
  MainItemHR,
  PositiveBalanceBar,
  NegativeBalanceBar,
  BalanceItemPLeft,
  BalanceItemPRight,
} from "../styles/MainItem.styled";

type BalanceItemProps = {
  name: string;
  value: number;
  ratio: number;
  index?: number;
};

export default function BalanceItem({
  name,
  value,
  ratio,
  index,
}: BalanceItemProps) {
  value = Math.abs(value) < 0.00001 ? 0 : value;

  const percentage = ratio * value;
  const width = Math.abs(percentage / 2);
  const absValue = Math.abs(value).toFixed(2);
  return (
    <>
      <BalanceItemDiv>
        <BalanceItemPLeft data-test-target={"balancesItemLeft" + index}>
          {value > 0 ? name : "-€" + absValue}
        </BalanceItemPLeft>
        <div>
          {value > 0 ? (
            <PositiveBalanceBar width={width}></PositiveBalanceBar>
          ) : (
            <NegativeBalanceBar width={width}></NegativeBalanceBar>
          )}
        </div>
        <BalanceItemPRight data-test-target={"balancesItemRight" + index}>
          {value > 0 ? "+€" + absValue : name}
        </BalanceItemPRight>
      </BalanceItemDiv>
      <MainItemHR />
    </>
  );
}
