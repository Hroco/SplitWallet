/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { IonFabButtonOrange } from '../styles/buttons.styled';
import MainItem from '../components/MainItem';
import { useNavigate } from 'react-router-dom';
import {
  IonButtons,
  IonContent,
  IonFab,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { add, settingsOutline } from 'ionicons/icons';
import { useDBFunctions } from '../lib/FrontendDBContext';

export default function HomePage() {
  const navigate = useNavigate();
  const [walletsList, setWalletsList] = useState<any>(null);
  const {
    syncWallets,
    getLocalUser,
    getWalletsWithEmail,
    listOfTables,
    initialized,
  } = useDBFunctions();

  useEffect(() => {
    if (!initialized) return;

    /* (async () => {
      const email = 'samko1311@gmail.com';
      const response = await axios.get(
        `/api/wallets/getWalletsWithEmail/${email}`
        );
        setPostResponse(response.data);
      })();*/
    (async () => {
      // We should sync walelts records in global and local dbs here
      console.log('syncing wallets');
      await syncWallets();
      console.log('synced wallets');
      /* const user = await getLocalUser();
      console.log('user', user);
      await listOfTables();*/
      const wallets = await getWalletsWithEmail('samko1311@gmail.com');

      if (wallets == undefined) return;

      wallets.sort((a: any, b: any) => {
        return a.date > b.date ? 1 : -1;
      });
      setWalletsList(wallets);
    })();
  }, [initialized]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>SplitWallet</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton autoHide={false} id="popover-button"></IonMenuButton>
            <IonPopover trigger="popover-button" dismissOnSelect={true}>
              <IonContent>
                <IonList>
                  <IonItem
                    button={true}
                    detail={false}
                    onClick={() => navigate(`/mysettings`)}
                  >
                    <IonIcon slot="start" icon={settingsOutline}></IonIcon>
                    <IonTitle>My Settings</IonTitle>
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {walletsList &&
          walletsList.map((item: any, index: number) => (
            <MainItem
              onClick={() => navigate(`/${item.id}/expenses`)}
              key={index}
              name={item.name}
              description={item.description}
            />
          ))}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButtonOrange onClick={() => navigate('/newWallet')}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButtonOrange>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}
