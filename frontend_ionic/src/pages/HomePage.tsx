import React, { useEffect, useState } from 'react';
import {
  WalletAddButton,
  BurgerButton,
  IonFabButtonOrange,
} from '../styles/buttons.styled';
import { MainContent, Navbar } from '../styles/mainContainers.styled';
import AddIcon from '-!svg-react-loader!../assets/icons/addPlus.svg';
import BurgerIcon from '-!svg-react-loader!../assets/icons/hamburger.svg';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import content from '../assets/testContent';
import MainItem from '../components/MainItem';
import { useHistory } from 'react-router-dom';
import BurgerMenu from '../components/DropDownMenu';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';
import { Button } from '../styles/DropDownMenu.styled';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import { add, settingsOutline } from 'ionicons/icons';

export default function HomePage() {
  const history = useHistory();
  const [postResponse, setPostResponse] = useState<any>(null);
  const [walletsList, setWalletsList] = useState<any>(null);

  useIonViewWillEnter(() => {
    // console.log('ionViewWillEnter event fired');
    (async () => {
      const email = 'samko1311@gmail.com';
      const response = await axios.get(
        `/api/wallets/getWalletsWithEmail/${email}`
      );
      setPostResponse(response.data);
    })();
  });

  /* useIonViewDidEnter(() => {
    console.log('ionViewDidEnter event fired');
  });

  useIonViewDidLeave(() => {
    console.log('ionViewDidLeave event fired');
  });

  useIonViewWillLeave(() => {
    console.log('ionViewWillLeave event fired');
  });*/

  /* useEffect(() => {
    console.log('getting data from server');
    (async () => {
      const email = 'samko1311@gmail.com';
      const response = await axios.get(
        `/api/wallets/getWalletsWithEmail/${email}`
      );
      console.log('response', response);
      setPostResponse(response.data);
    })();
  }, []);*/

  useEffect(() => {
    const { wallets } = postResponse || {};

    if (wallets == undefined) return;

    wallets.sort((a: any, b: any) => {
      return a.date > b.date ? 1 : -1;
    });
    setWalletsList(wallets);
  }, [postResponse]);

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
                    onClick={() => history.push(`/mysettings`)}
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
              onClick={() => history.push(`/${item.id}/expenses`)}
              key={index}
              name={item.name}
              description={item.description}
            />
          ))}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButtonOrange onClick={() => history.push('/newWallet')}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButtonOrange>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}
