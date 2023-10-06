import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  BalancesMainContent,
  Navbar,
  MiddlePannel,
  BottomContent,
  BalancesTopPannel,
} from '../styles/mainContainers.styled';
import { ExpenseButton } from '../styles/buttons.styled';
import BalanceItem from '../components/BalanceItem';
import ReimbursementItem from '../components/ReimbursementItem';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useDBFunctions } from '../lib/FrontendDBContext';

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
  const [walletUsers, setWalletUsers] = useState<any[]>([]);
  const [bilanceBarPositiveRatio, setBilanceBarPositiveRatio] =
    useState<number>(0);
  const [bilanceBarNegativeRatio, setBilanceBarNegativeRatio] =
    useState<number>(0);
  const [reimbursements, setReimbursements] = useState<any[]>([]);
  const { getWalletUsersByWalletId } = useDBFunctions();

  useIonViewWillEnter(async () => {
    const users = await getWalletUsersByWalletId(walletId);
    // console.log('walletUsers', users);
    if (users) {
      setWalletUsers(users);
    }
  });

  useEffect(() => {
    if (!walletUsers.length) return;

    const sortedUsers = [...walletUsers].sort((a, b) => a.bilance - b.bilance);

    const lowestValueObject = sortedUsers[0];
    const highestValueObject = sortedUsers[sortedUsers.length - 1];

    setBilanceBarPositiveRatio(100 / Math.abs(highestValueObject.bilance));
    setBilanceBarNegativeRatio(100 / Math.abs(lowestValueObject.bilance));

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>XXX</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton autoHide={false} id="balance-popover" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <Navbar>
        <ExpenseButton onClick={() => history.push(`/${walletId}/expenses`)}>
          <h1>MY EXPENSES</h1>
        </ExpenseButton>
        <ExpenseButton onClick={() => history.push(`/${walletId}/balances`)}>
          <h1>BALANCES</h1>
        </ExpenseButton>
      </Navbar>
      <IonContent>
        <BalancesTopPannel>
          {walletUsers.map((walletUser, index) => (
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
          {reimbursements.map((reimbursement, index) => (
            <ReimbursementItem
              key={index}
              payer={reimbursement.to}
              debtor={reimbursement.from}
              price={reimbursement.amount}
            />
          ))}
        </BottomContent>
      </IonContent>
    </IonPage>
  );
}
