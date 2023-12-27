import React from "react";
import {
  MainItemHR,
  ReimbursementItemDiv,
  ReimbursementDataDiv,
} from "../styles/ReimbursementItem.styled";

type ReimbursementItemProps = {
  payer: string;
  debtor: string;
  price: number;
  index?: number;
};

export default function ReimbursementItem({
  payer,
  debtor,
  price,
  index,
}: ReimbursementItemProps) {
  return (
    <>
      <ReimbursementItemDiv>
        <ReimbursementDataDiv>
          <div>
            <h2 data-test-target={"reinbursementItemPayer" + index}>{payer}</h2>
            <p>owes</p>
            <h2 data-test-target={"reinbursementItemDebtor" + index}>
              {debtor}
            </h2>
          </div>
          <h3 data-test-target={"reinbursementItemAmount" + index}>
            €{price.toFixed(2)}
          </h3>
        </ReimbursementDataDiv>
        <button>More options</button>
      </ReimbursementItemDiv>
    </>
  );
}
