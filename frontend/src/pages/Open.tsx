import React, { useEffect, useState } from 'react';
import {
  TopPannel,
  MainContent,
  BurgerButton,
  BottomPannel,
} from '../styles/MainItemPage.styled';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import TrashIcon from '-!svg-react-loader!../assets/icons/trash.svg';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MainItem from '../components/MainItem';

export default function Open() {
  const { walletId, walletItemId } = useParams();
  const navigate = useNavigate();
  const [postResponse, setPostResponse] = useState<any>(null);
  const [walletItem, setWalletItem] = useState<any>(null);
  const [postResponse2, setPostResponse2] = useState<any>(null);
  const [currentWalletUser, setCurrentWalletUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const id = walletItemId;
      const response = await axios.get(
        `/api/wallets/getWalletItemByWalletItemId/${id}`
      );
      setPostResponse(response.data);
    })();
  }, []);

  useEffect(() => {
    const { walletItem } = postResponse || {};
    console.log('walletItem', walletItem);
    setWalletItem(walletItem);
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

  if (walletItem == undefined) return <h1>Loading</h1>;
  if (currentWalletUser == undefined) return <h1>Loading</h1>;

  const isCurrentUserOneOfRecievers = walletItem.recievers.some(
    (reciever: any) => reciever.reciever.id == currentWalletUser.id
  );

  // console.log('isCurrentUserOneOfRecievers', isCurrentUserOneOfRecievers);

  function deleteWalletItem() {
    axios.delete(`/api/wallets/deleteWalletItemById/${walletItemId}`);
    navigate(`/${walletId}/expenses`);
  }

  return (
    <>
      <TopPannel>
        <BurgerButton onClick={() => navigate(`/${walletId}/expenses`)}>
          <BackIcon />
        </BurgerButton>
        <h1>{walletItem.name}</h1>
        <BurgerButton onClick={deleteWalletItem}>
          <TrashIcon />
        </BurgerButton>
        <BurgerButton
          onClick={() => navigate(`/${walletId}/${walletItemId}/edit`)}
        >
          Edit
        </BurgerButton>
      </TopPannel>
      <MainContent>
        <p>Paid by {walletItem.payer.name}</p>
        <p>Date {walletItem.date}</p>
        <p>
          For {walletItem.recievers.length} participants,{' '}
          {isCurrentUserOneOfRecievers ? 'including me' : 'but not me'}
        </p>
        {walletItem.recievers &&
          walletItem.recievers.map((reciever: any, index: number) => (
            <MainItem
              key={index}
              name={reciever.reciever.name}
              price={reciever.amount}
            />
          ))}
      </MainContent>
      <BottomPannel>
        <BurgerButton onClick={() => navigate('/')}>
          <BackIcon />
          <p>Previouse</p>
        </BurgerButton>
        <BurgerButton rotate={'180'} onClick={() => navigate('/')}>
          <p>Next</p>
          <BackIcon />
        </BurgerButton>
      </BottomPannel>
    </>
  );
}
