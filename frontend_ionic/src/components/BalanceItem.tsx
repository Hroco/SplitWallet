import React from 'react';
import {
  BalanceItemDiv,
  MainItemHR,
  PositiveBalanceBar,
  NegativeBalanceBar,
  BalanceItemPLeft,
  BalanceItemPRight,
} from '../styles/MainItem.styled';

type BalanceItemProps = {
  name: string;
  value: number;
  ratio: number;
};

export default function BalanceItem({ name, value, ratio }: BalanceItemProps) {
  value = Math.abs(value) < 0.00001 ? 0 : value;

  const percentage = ratio * value;
  const width = Math.abs(percentage / 2);
  const absValue = Math.abs(value).toFixed(2);
  return (
    <>
      <BalanceItemDiv>
        <BalanceItemPLeft>
          {value > 0 ? name : '-€' + absValue}
        </BalanceItemPLeft>
        <div>
          {value > 0 ? (
            <PositiveBalanceBar width={width}></PositiveBalanceBar>
          ) : (
            <NegativeBalanceBar width={width}></NegativeBalanceBar>
          )}
        </div>
        <BalanceItemPRight>
          {value > 0 ? '+€' + absValue : name}
        </BalanceItemPRight>
      </BalanceItemDiv>
      <MainItemHR />
    </>
  );
}
