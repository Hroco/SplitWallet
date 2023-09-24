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
import { useLocation, useParams, useHistory } from 'react-router-dom';
// import axios from 'axios';
import MainItem from '../components/MainItem';
import LoadingScreen from '../components/LoadingScreen';
import {
  ImageIconMenu,
  SecondaryItemMenu,
  ThirdItemMenu,
} from '../styles/Open.styled';
import CameraIcon from '-!svg-react-loader!../assets/icons/camera.svg';
import { ArrowRight } from '../styles/utills.styled';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useDBFunctions } from '../lib/FrontendDBContext';

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear(); // Get year

  return `${day}/${month}/${year}`;
}

interface RouteParams {
  walletId: string;
  walletItemId: string;
}

export default function Open() {
  const { walletId, walletItemId } = useParams<RouteParams>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sortType = searchParams.get('sort') || 'DateDesc';
  // console.log('sortType', sortType);
  const history = useHistory();
  const [postResponse, setPostResponse] = useState<any>(null);
  const [walletItem, setWalletItem] = useState<any>(null);
  const [postResponse2, setPostResponse2] = useState<any>(null);
  const [postResponse3, setPostResponse3] = useState<any>(null);
  const [currentWalletUser, setCurrentWalletUser] = useState<any>(null);
  const [prevWalletItem, setPrevWalletItem] = useState<any>(null);
  const [nextWalletItem, setNextWalletItem] = useState<any>(null);
  const {
    getWalletItemByWalletItemId,
    getWalletUserByEmailAndWalletId,
    getPrevAndNextWalletItemByWalletItemIdAndSortType,
    deleteWalletItemById,
  } = useDBFunctions();

  useEffect(() => {
    (async () => {
      const walletItem = await getWalletItemByWalletItemId(walletItemId);
      const walletUser = await getWalletUserByEmailAndWalletId(
        'samko1311@gmail.com',
        walletId
      );

      const { walletItemPrev, walletItemNext } =
        await getPrevAndNextWalletItemByWalletItemIdAndSortType(
          walletItemId,
          sortType
        );

      if (walletItem == undefined) return;
      if (walletUser == undefined) return;
      if (walletItemPrev == undefined) return;
      if (walletItemNext == undefined) return;

      setWalletItem(walletItem);
      setCurrentWalletUser(walletUser);
      setPrevWalletItem(walletItemPrev);
      setNextWalletItem(walletItemNext);
    })();
  }, [walletItemId]);

  /* useEffect(() => {
    (async () => {
      const id = walletItemId;
      const response = await axios.get(
        `/api/wallets/getWalletItemByWalletItemId/${id}`
      );
      setPostResponse(response.data);
    })();
  }, [walletItemId]);

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
  }, [walletItemId]);

  useEffect(() => {
    const { walletUser } = postResponse2 || {};
    // console.log('walletUser', walletUser);
    setCurrentWalletUser(walletUser);
  }, [postResponse2]);

  useEffect(() => {
    (async () => {
      const data = [walletItemId, sortType];
      const response = await axios.get(
        `/api/wallets/getPrevAndNextWalletItemByWalletItemIdAndSortType/${data}`
      );
      setPostResponse3(response.data);
    })();
  }, [walletItemId]);

  useEffect(() => {
    const { walletItemPrev, walletItemNext } = postResponse3 || {};
    setPrevWalletItem(walletItemPrev);
    setNextWalletItem(walletItemNext);
  }, [postResponse3]);*/

  if (walletItem == undefined) {
    console.log('LoadingScreen because walletItem', walletItem);
    return <LoadingScreen />;
  }
  if (currentWalletUser == undefined) {
    console.log('LoadingScreen because currentWalletUser', currentWalletUser);
    return <LoadingScreen />;
  }

  const isCurrentUserOneOfRecievers = walletItem.recievers.some(
    (reciever: any) => reciever.reciever.id == currentWalletUser.id
  );

  // console.log('isCurrentUserOneOfRecievers', isCurrentUserOneOfRecievers);

  function deleteWalletItem() {
    // axios.delete(`/api/wallets/deleteWalletItemById/${walletItemId}`);
    deleteWalletItemById(walletItemId);
    history.push(`/${walletId}/expenses`);
  }

  const dateInput = new Date(walletItem.date);
  const formatedDate = formatDate(dateInput);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref={`/${walletId}/expenses`}
            ></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              onClick={() => history.push(`/${walletId}/${walletItemId}/edit`)}
            >
              Edit
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <SecondaryItemMenu>
          <div>
            <h1>{walletItem.name}</h1>
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
      </IonContent>
      <IonFooter>
        <IonToolbar>
          {prevWalletItem ? (
            <IonButtons slot="start">
              <IonButton
                onClick={() =>
                  history.push(
                    `/${walletId}/${prevWalletItem.id}/open?sort=${sortType}`
                  )
                }
              >
                <div>
                  <BackIcon />
                </div>
                <IonTitle>Previouse</IonTitle>
              </IonButton>
            </IonButtons>
          ) : (
            <div></div>
          )}
          {nextWalletItem ? (
            <IonButtons slot="end">
              <IonButton
                onClick={() =>
                  history.push(
                    `/${walletId}/${nextWalletItem.id}/open?sort=${sortType}`
                  )
                }
              >
                <IonTitle>Next</IonTitle>
                <ArrowRight>
                  <BackIcon />
                </ArrowRight>
              </IonButton>
            </IonButtons>
          ) : (
            <div></div>
          )}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}
