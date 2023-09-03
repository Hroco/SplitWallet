import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TopPannel,
  MainContent,
  AddButton,
  BurgerButton,
  BottomPannel,
  ExpenseButton,
} from '../styles/MainItemPage.styled';
import BalanceItem from '../components/BalanceItem';
import BurgerIcon from '-!svg-react-loader!../assets/icons/hamburger.svg';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import axios from 'axios';

export default function Balances() {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const [postResponse, setPostResponse] = useState<any>(null);
  const [walletUsers, setWalletUsers] = useState<any>(null);
  const [bilanceBarPositiveRatio, setBilanceBarPositiveRatio] =
    useState<number>(0);
  const [bilanceBarNegativeRatio, setBilanceBarNegativeRatio] =
    useState<number>(0);

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
    // console.log('walletUsers', walletUsers);
    setWalletUsers(walletUsers);
  }, [postResponse]);

  useEffect(() => {
    if (walletUsers == undefined) return;

    const lowestValueObject = walletUsers.reduce((prev: any, current: any) =>
      prev.value > current.value ? current : prev
    );
    setBilanceBarPositiveRatio(100 / Math.abs(lowestValueObject.bilance));

    const highestValueObject = walletUsers.reduce((prev: any, current: any) =>
      prev.value > current.value ? prev : current
    );
    setBilanceBarNegativeRatio(100 / Math.abs(highestValueObject.bilance));
  }, [walletUsers]);

  // console.log('bilanceBarPositiveRatio', bilanceBarPositiveRatio);
  // console.log('bilanceBarNegativeRatio', bilanceBarNegativeRatio);

  return (
    <>
      <TopPannel>
        <BurgerButton onClick={() => navigate('/')}>
          <BackIcon />
        </BurgerButton>
        <h1>Grappe 2023</h1>
        <BurgerButton>
          <BurgerIcon />
        </BurgerButton>
      </TopPannel>
      <TopPannel>
        <ExpenseButton onClick={() => navigate(`/${walletId}/expenses`)}>
          <h1>MY EXPENSES</h1>
        </ExpenseButton>
        <ExpenseButton onClick={() => navigate(`/${walletId}/balances`)}>
          <h1>BALANCES</h1>
        </ExpenseButton>
      </TopPannel>
      <MainContent>
        {walletUsers &&
          walletUsers.map((walletUser: any, index: number) => (
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
      </MainContent>
    </>
  );
}
