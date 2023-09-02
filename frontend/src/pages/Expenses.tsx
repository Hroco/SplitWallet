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
} from '../styles/MainItemPage.styled';
import AddIcon from '-!svg-react-loader!../assets/icons/addPlus.svg';
import BurgerIcon from '-!svg-react-loader!../assets/icons/hamburger.svg';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import axios from 'axios';

export default function Expenses() {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const [postResponse, setPostResponse] = useState<any>(null);
  const [walletItems, setWalletItems] = useState<any>(null);

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
    const { walletItems } = postResponse || {};
    setWalletItems(walletItems);
  }, [postResponse]);

  console.log('walletItems', walletItems);

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
          <h2>267.35</h2>
        </div>
        <AddButton onClick={() => navigate(`/${walletId}/add`)}>
          <AddIcon />
        </AddButton>
        <div>
          <p>TOTAL EXPENSE</p>
          <h2>937.35</h2>
        </div>
      </BottomPannel>
    </>
  );
}
