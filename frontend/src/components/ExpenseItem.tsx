import React from 'react';
import {
  ExpenseItemDiv,
  MainItemHR,
  DateAndPriceDiv,
} from '../styles/ExpenseItem.styled';

type ExpenseItemProps = {
  name: string;
  payer: string;
  price: number;
  date: Date;
  onClick?: () => void;
};

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear(); // Get year

  return `${day}/${month}/${year}`;
}

export default function ExpenseItem({
  name,
  payer,
  price,
  date,
  onClick,
}: ExpenseItemProps) {
  const dateInput = new Date(date);
  const formatedDate = formatDate(dateInput);

  return (
    <>
      <ExpenseItemDiv onClick={onClick}>
        <div>
          <h2>{name}</h2>
          <p>paid by {payer}</p>
        </div>
        <DateAndPriceDiv>
          <h2>€ {price.toFixed(2)}</h2>
          <p>{formatedDate}</p>
        </DateAndPriceDiv>
      </ExpenseItemDiv>
      <MainItemHR />
    </>
  );
}
