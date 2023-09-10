import React, { useEffect, useState } from 'react';
import {
  BurgerButton,
  NavigationNextItemButton,
  NavigationPrevItemButton,
} from '../styles/buttons.styled';
import {
  MiddlePannel,
  Navbar,
  OpenFooter,
  OpenMainContent,
} from '../styles/mainContainers.styled';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import TrashIcon from '-!svg-react-loader!../assets/icons/trash.svg';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MainItem from '../components/MainItem';
import LoadingScreen from '../components/LoadingScreen';
import {
  ImageIconMenu,
  SecondaryItemMenu,
  ThirdItemMenu,
} from '../styles/Open.styled';
import CameraIcon from '-!svg-react-loader!../assets/icons/camera.svg';
import { ArrowRight } from '../styles/utills.styled';

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear(); // Get year

  return `${day}/${month}/${year}`;
}

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

  if (walletItem == undefined) return <LoadingScreen />;
  if (currentWalletUser == undefined) return <LoadingScreen />;

  const isCurrentUserOneOfRecievers = walletItem.recievers.some(
    (reciever: any) => reciever.reciever.id == currentWalletUser.id
  );

  // console.log('isCurrentUserOneOfRecievers', isCurrentUserOneOfRecievers);

  function deleteWalletItem() {
    axios.delete(`/api/wallets/deleteWalletItemById/${walletItemId}`);
    navigate(`/${walletId}/expenses`);
  }

  const dateInput = new Date(walletItem.date);
  const formatedDate = formatDate(dateInput);

  return (
    <>
      <Navbar>
        <BurgerButton onClick={() => navigate(`/${walletId}/expenses`)}>
          <BackIcon />
        </BurgerButton>

        <BurgerButton
          onClick={() => navigate(`/${walletId}/${walletItemId}/edit`)}
        >
          Edit
        </BurgerButton>
      </Navbar>
      <OpenMainContent>
        <h1>{walletItem.name}</h1>
        <SecondaryItemMenu>
          <div>
            <h3>€{walletItem.amount}</h3>
            <ThirdItemMenu>
              <p>Paid by {walletItem.payer.name}</p>
              <p>Date {formatedDate}</p>
            </ThirdItemMenu>
            <ImageIconMenu>
              <CameraIcon />
              <p>Add an Image</p>
            </ImageIconMenu>
          </div>
        </SecondaryItemMenu>
        <MiddlePannel>
          For {walletItem.recievers.length} participants,{' '}
          {isCurrentUserOneOfRecievers ? 'including me' : 'but not me'}
        </MiddlePannel>

        {walletItem.recievers &&
          walletItem.recievers.map((reciever: any, index: number) => (
            <MainItem
              key={index}
              name={reciever.reciever.name}
              price={reciever.amount}
            />
          ))}
      </OpenMainContent>
      <OpenFooter>
        <NavigationPrevItemButton onClick={() => navigate('/')}>
          <div>
            <BackIcon />
          </div>
          <p>Previouse</p>
        </NavigationPrevItemButton>
        <NavigationNextItemButton rotate={'180'} onClick={() => navigate('/')}>
          <p>Next</p>
          <ArrowRight>
            <BackIcon />
          </ArrowRight>
        </NavigationNextItemButton>
      </OpenFooter>
    </>
  );
}
