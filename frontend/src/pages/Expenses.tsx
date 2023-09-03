import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import contentData from '../assets/testContentData';
import MainItem from '../components/MainItem';
import {
  TopPannel,
  MainContent,
  AddButton,
  BurgerButton,
  BottomPannel,
  ExpenseButton,
} from '../styles/MainItemPage.styled';
import AddIcon from '-!svg-react-loader!../assets/icons/addPlus.svg';
import BurgerIcon from '-!svg-react-loader!../assets/icons/hamburger.svg';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import HistoryIcon from '-!svg-react-loader!../assets/icons/history.svg';
import TrashIcon from '-!svg-react-loader!../assets/icons/trash.svg';
import axios from 'axios';

export default function Expenses() {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const [postResponse, setPostResponse] = useState<any>(null);
  const [postResponse2, setPostResponse2] = useState<any>(null);
  const [walletItems, setWalletItems] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [currentWalletUser, setCurrentWalletUser] = useState<any>(null);

  if (walletId == undefined) throw new Error('WalletId is undefined.');
  if (typeof walletId != 'string') throw new Error('WalletId is not string.');

  useEffect(() => {
    (async () => {
      const id = walletId;
      const response = await axios.get(
        `/api/wallets/getWalletItemsByWalletId/${id}`
      );
      setPostResponse(response.data);
    })();
  }, []);

  useEffect(() => {
    const { wallet, walletItems } = postResponse || {};
    // console.log('wallet', wallet);
    setWalletItems(walletItems);
    setWallet(wallet);
  }, [postResponse]);

  useEffect(() => {
    (async () => {
      const data = ['samko1311@gmail.com', walletId];
      const response = await axios.get(
        `/api/wallets/getWalletUserByEmailAndWalletId/${data}`
      );
      setPostResponse2(response.data);
    })();
  }, []);

  useEffect(() => {
    const { walletUser } = postResponse2 || {};
    // console.log('walletUser', walletUser);
    setCurrentWalletUser(walletUser);
  }, [postResponse2]);

  // console.log('walletItems', walletItems);
  // console.log('currentWalletUser', currentWalletUser);

  function deleteWallet() {
    axios.delete(`/api/wallets/deleteWalletById/${walletId}`);
    navigate('/');
  }

  if (wallet == undefined) return <h1>Loading</h1>;
  if (currentWalletUser == undefined) return <h1>Loading</h1>;

  return (
    <>
      <TopPannel>
        <BurgerButton onClick={() => navigate('/')}>
          <BackIcon />
        </BurgerButton>
        <h1>{wallet.name}</h1>
        <BurgerButton onClick={() => navigate(`/${walletId}/feed`)}>
          <HistoryIcon />
        </BurgerButton>
        <BurgerButton onClick={deleteWallet}>
          <TrashIcon />
        </BurgerButton>
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
        {walletItems &&
          walletItems.map((walletItem: any, index: number) => (
            <MainItem
              onClick={() => navigate(`/${walletId}/${walletItem.id}/open`)}
              key={index}
              name={walletItem.name}
              description={walletItem.description}
              price={walletItem.price}
              date={walletItem.date}
            />
          ))}
      </MainContent>
      <BottomPannel>
        <div>
          <p>MY TOTAL</p>
          <h2>{currentWalletUser.total}</h2>
        </div>
        <AddButton onClick={() => navigate(`/${walletId}/add`)}>
          <AddIcon />
        </AddButton>
        <div>
          <p>TOTAL EXPENSE</p>
          <h2>{wallet.total}</h2>
        </div>
      </BottomPannel>
    </>
  );
}
