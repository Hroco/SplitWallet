import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import contentData from '../assets/testContentData';
import ExpenseItem from '../components/ExpenseItem';
import { TotalExpenseDiv } from '../styles/MainItemPage.styled';
import {
  WalletItemAddButton,
  BurgerButton,
  ExpenseButton,
} from '../styles/buttons.styled';
import {
  ExpenseMainContent,
  Navbar,
  ExpenseFooter,
} from '../styles/mainContainers.styled';
import AddIcon from '-!svg-react-loader!../assets/icons/addPlus.svg';
import BurgerIcon from '-!svg-react-loader!../assets/icons/hamburger.svg';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import HistoryIcon from '-!svg-react-loader!../assets/icons/history.svg';
import TrashIcon from '-!svg-react-loader!../assets/icons/trash.svg';
import EditIcon from '-!svg-react-loader!../assets/icons/edit.svg';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';

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

  if (wallet == undefined) return <LoadingScreen />;
  if (currentWalletUser == undefined) return <LoadingScreen />;

  return (
    <>
      <Navbar>
        <BurgerButton onClick={() => navigate('/')}>
          <BackIcon />
        </BurgerButton>
        <h1>{wallet.name}</h1>
        <BurgerButton onClick={() => navigate(`/${walletId}/feed`)}>
          <HistoryIcon />
        </BurgerButton>
        <BurgerButton onClick={() => navigate(`/${walletId}/edit`)}>
          <EditIcon />
        </BurgerButton>
        <BurgerButton onClick={deleteWallet}>
          <TrashIcon />
        </BurgerButton>
        <BurgerButton>
          <BurgerIcon />
        </BurgerButton>
      </Navbar>
      <Navbar>
        <ExpenseButton onClick={() => navigate(`/${walletId}/expenses`)}>
          <h1>MY EXPENSES</h1>
        </ExpenseButton>
        <ExpenseButton onClick={() => navigate(`/${walletId}/balances`)}>
          <h1>BALANCES</h1>
        </ExpenseButton>
      </Navbar>
      <ExpenseMainContent>
        {walletItems &&
          walletItems.map((walletItem: any, index: number) => (
            <ExpenseItem
              onClick={() => navigate(`/${walletId}/${walletItem.id}/open`)}
              key={index}
              name={walletItem.name}
              payer={walletItem.payer.name}
              price={walletItem.amount}
              date={walletItem.date}
              type={walletItem.type}
            />
          ))}
      </ExpenseMainContent>
      <ExpenseFooter>
        <div>
          <p>MY TOTAL</p>
          <h2>€ {currentWalletUser.total.toFixed(2)}</h2>
        </div>
        <WalletItemAddButton onClick={() => navigate(`/${walletId}/add`)}>
          <AddIcon />
        </WalletItemAddButton>
        <TotalExpenseDiv>
          <p>TOTAL EXPENSES</p>
          <h2>€ {wallet.total.toFixed(2)}</h2>
        </TotalExpenseDiv>
      </ExpenseFooter>
    </>
  );
}
