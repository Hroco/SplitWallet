import React from 'react';
import {
  ExpenseItemDiv,
  MainItemHR,
  DateAndPriceDiv,
  ExpenseItemDivOrange,
  ExpenseItemDivGreen,
  ExpenseItemDivBlue,
} from '../styles/ExpenseItem.styled';

type ExpenseItemProps = {
  name: string;
  payer: string;
  price: number;
  date: Date;
  type: string;
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
  type,
  onClick,
}: ExpenseItemProps) {
  const dateInput = new Date(date);
  const formatedDate = formatDate(dateInput);

  function drawItemContent() {
    return (
      <>
        <div>
          <h2>{name}</h2>
          <p>paid by {payer}</p>
        </div>
        <DateAndPriceDiv>
          <h2>
            {type == 'income' && '-'}€{price.toFixed(2)}
          </h2>
          <p>{formatedDate}</p>
        </DateAndPriceDiv>
      </>
    );
  }

  function drawExpenseItem() {
    if (type === 'expense') {
      return (
        <ExpenseItemDivOrange onClick={onClick}>
          {drawItemContent()}
        </ExpenseItemDivOrange>
      );
    }
    if (type === 'income') {
      return (
        <ExpenseItemDivGreen onClick={onClick}>
          {drawItemContent()}
        </ExpenseItemDivGreen>
      );
    }
    if (type === 'moneyTransfer') {
      return (
        <ExpenseItemDivBlue onClick={onClick}>
          {drawItemContent()}
        </ExpenseItemDivBlue>
      );
    }
  }

  return (
    <>
      {drawExpenseItem()}
      <MainItemHR />
    </>
  );
}
