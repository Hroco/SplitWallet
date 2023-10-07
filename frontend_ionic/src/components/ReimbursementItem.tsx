import React from 'react';
import {
  MainItemHR,
  ReimbursementItemDiv,
  ReimbursementDataDiv,
} from '../styles/ReimbursementItem.styled';

type ReimbursementItemProps = {
  payer: string;
  debtor: string;
  price: number;
};

export default function ReimbursementItem({
  payer,
  debtor,
  price,
}: ReimbursementItemProps) {
  return (
    <>
      <ReimbursementItemDiv>
        <ReimbursementDataDiv>
          <div>
            <h2>{payer}</h2>
            <p>owes</p>
            <h2>{debtor}</h2>
          </div>
          <h3>€{price.toFixed(2)}</h3>
        </ReimbursementDataDiv>
        <button>More options</button>
      </ReimbursementItemDiv>
    </>
  );
}
