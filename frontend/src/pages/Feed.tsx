import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import axios from 'axios';

export default function Feed() {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const [postResponse, setPostResponse] = useState<any>(null);
  const [walletItems, setWalletItems] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);

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
    console.log('wallet', wallet);
    setWalletItems(walletItems);
    setWallet(wallet);
  }, [postResponse]);

  if (wallet == undefined) return <h1>Loading</h1>;

  return (
    <>
      <TopPannel>
        <BurgerButton onClick={() => navigate(`/${walletId}/expenses`)}>
          <BackIcon />
        </BurgerButton>
        <h1>History: {wallet.name}</h1>
      </TopPannel>
      <MainContent>
        <h1>Feed</h1>
      </MainContent>
      <BottomPannel>
        <h1>New message input here</h1>
      </BottomPannel>
    </>
  );
}
