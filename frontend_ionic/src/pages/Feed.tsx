import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainItem from '../components/MainItem';
import { BurgerButton } from '../styles/buttons.styled';
import {
  MainContent,
  FeedFooter,
  Navbar,
} from '../styles/mainContainers.styled';
import AddIcon from '-!svg-react-loader!../assets/icons/addPlus.svg';
import BurgerIcon from '-!svg-react-loader!../assets/icons/hamburger.svg';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import HistoryIcon from '-!svg-react-loader!../assets/icons/history.svg';
// import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useDBFunctions } from '../lib/FrontendDBContext';

export default function Feed() {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const [postResponse, setPostResponse] = useState<any>(null);
  const [walletItems, setWalletItems] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const { getWalletItemsByWalletId, initialized } = useDBFunctions();

  if (walletId == undefined) throw new Error('WalletId is undefined.');
  if (typeof walletId != 'string') throw new Error('WalletId is not string.');

  useEffect(() => {
    if (!initialized) return;
    (async () => {
      const wallet = await getWalletItemsByWalletId(walletId);

      if (wallet == undefined) return;

      setWallet(wallet);
    })();
  }, [initialized]);

  /* useEffect(() => {
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
  }, [postResponse]);*/

  if (wallet == undefined) return <LoadingScreen />;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref={`/${walletId}/expenses`}
            ></IonBackButton>
          </IonButtons>
          <IonTitle>History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h1>Feed</h1>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle>New message input here</IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}
