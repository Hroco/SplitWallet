import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  BalancesMainContent,
  Navbar,
  MiddlePannel,
  BottomContent,
  BalancesTopPannel,
} from '../styles/mainContainers.styled';
import { BurgerButton, ExpenseButton } from '../styles/buttons.styled';
import BalanceItem from '../components/BalanceItem';
import BurgerIcon from '-!svg-react-loader!../assets/icons/hamburger.svg';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import axios from 'axios';
import ReimbursementItem from '../components/ReimbursementItem';
import { IonPage } from '@ionic/react';

function findLowestBalanceObject(data: any[]) {
  let lowestBalanceObject = null;
  let lowestBalance = Infinity; // Initialize with a high value

  for (const item of data) {
    if (item.bilance < lowestBalance) {
      lowestBalance = item.bilance;
      lowestBalanceObject = item;
    }
  }

  return lowestBalanceObject;
}

function findHighestBalanceObject(data: any[]) {
  let highestBalanceObject = null;
  let highestBalance = Infinity; // Initialize with a high value

  for (const item of data) {
    if (item.bilance < highestBalance) {
      highestBalance = item.bilance;
      highestBalanceObject = item;
    }
  }

  return highestBalanceObject;
}

function deepCopy(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    const copyArray = [];
    for (let i = 0; i < obj.length; i++) {
      copyArray[i] = deepCopy(obj[i]);
    }
    return copyArray;
  }

  const copyObject: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copyObject[key] = deepCopy(obj[key]);
    }
  }

  return copyObject;
}

interface RouteParams {
  walletId: string;
}

export default function Balances() {
  const { walletId } = useParams<RouteParams>();
  const history = useHistory();
  const [postResponse, setPostResponse] = useState<any>(null);
  const [walletUsers, setWalletUsers] = useState<any>(null);
  const [bilanceBarPositiveRatio, setBilanceBarPositiveRatio] =
    useState<number>(0);
  const [bilanceBarNegativeRatio, setBilanceBarNegativeRatio] =
    useState<number>(0);
  const [reimbursements, setReimbursements] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const id = walletId;
      const response = await axios.get(
        `/api/wallets/getWalletUsersByWalletId/${id}`
      );
      setPostResponse(response.data);
    })();
  }, []);

  useEffect(() => {
    const { walletUsers } = postResponse || {};
    if (walletUsers == undefined) return;
    setWalletUsers(walletUsers);
  }, [postResponse]);

  useEffect(() => {
    if (walletUsers == undefined) return;
    const lowestValueObject = findLowestBalanceObject(walletUsers);
    /* walletUsers.reduce((prev: any, current: any) =>
      prev.value > current.value ? current : prev
    );*/
    console.log('lowestValueObject', lowestValueObject);
    setBilanceBarPositiveRatio(100 / Math.abs(lowestValueObject.bilance));

    const highestValueObject = findHighestBalanceObject(walletUsers);
    /* const highestValueObject = walletUsers.reduce((prev: any, current: any) =>
      prev.value > current.value ? prev : current
    );*/
    console.log('highestValueObject', highestValueObject);
    setBilanceBarNegativeRatio(100 / Math.abs(highestValueObject.bilance));

    calculateReimbursements();
  }, [walletUsers]);

  function calculateReimbursements() {
    if (walletUsers == undefined) return;
    const users = deepCopy(walletUsers);
    users.sort((a: any, b: any) => a.name.localeCompare(b.name));

    // Calculate the total balance of all users
    const totalBalance = users.reduce(
      (total: any, user: any) => total + user.bilance,
      0
    );

    // Calculate the average balance per user
    const averageBalance = totalBalance / users.length;

    // Create lists for users who owe money and are owed money
    const debtors = users.filter((user: any) => user.bilance < averageBalance);
    const creditors = users.filter(
      (user: any) => user.bilance > averageBalance
    );

    // Sort debtors and creditors by their balances in descending order
    debtors.sort((a: any, b: any) => a.name.localeCompare(b.name));
    creditors.sort((a: any, b: any) => b.name.localeCompare(a.name));

    const transactions = [];

    for (const debtor of debtors) {
      while (debtor.bilance < averageBalance) {
        const creditor = creditors.pop();
        if (!creditor) {
          // No creditor left to reimburse the debtor
          break;
        }

        const amount = Math.min(
          averageBalance - debtor.bilance,
          creditor.bilance
        );

        debtor.bilance += amount;
        creditor.bilance -= amount;

        transactions.push({
          from: creditor.name,
          to: debtor.name,
          amount,
        });

        if (creditor.bilance > averageBalance) {
          // Creditor can reimburse more debtors in the future
          creditors.push(creditor);
        }
      }
    }
    setReimbursements(transactions);
  }

  console.log('walletUsers', walletUsers);

  return (
    <IonPage>
      <Navbar>
        <BurgerButton onClick={() => history.push('/')}>
          <BackIcon />
        </BurgerButton>
        <h1>Grappe 2023</h1>
        <BurgerButton>
          <BurgerIcon />
        </BurgerButton>
      </Navbar>
      <Navbar>
        <ExpenseButton onClick={() => history.push(`/${walletId}/expenses`)}>
          <h1>MY EXPENSES</h1>
        </ExpenseButton>
        <ExpenseButton onClick={() => history.push(`/${walletId}/balances`)}>
          <h1>BALANCES</h1>
        </ExpenseButton>
      </Navbar>
      <BalancesMainContent>
        <BalancesTopPannel>
          {walletUsers &&
            walletUsers
              .sort((a: any, b: any) => a.name.localeCompare(b.name))
              .map((walletUser: any, index: number) => (
                <BalanceItem
                  key={index}
                  name={walletUser.name}
                  value={walletUser.bilance}
                  ratio={
                    walletUser.bilance > 0
                      ? bilanceBarPositiveRatio
                      : bilanceBarNegativeRatio
                  }
                />
              ))}
        </BalancesTopPannel>
        <MiddlePannel>HOW SHOULD I BALANCE</MiddlePannel>
        <BottomContent>
          {reimbursements &&
            reimbursements.map((reimbursement: any, index: number) => (
              <ReimbursementItem
                key={index}
                payer={reimbursement.to}
                debtor={reimbursement.from}
                price={reimbursement.amount}
              />
            ))}
        </BottomContent>
      </BalancesMainContent>
    </IonPage>
  );
}
