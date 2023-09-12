import React, { useEffect, useState } from 'react';
import { WalletAddButton, BurgerButton } from '../styles/buttons.styled';
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
} from '@ionic/react';
import { add } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

export default function HomePage() {
  const history = useHistory();
  const [postResponse, setPostResponse] = useState<any>(null);
  const [walletsList, setWalletsList] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const email = 'samko1311@gmail.com';
      const response = await axios.get(
        `/api/wallets/getWalletsWithEmail/${email}`
      );
      console.log('response', response);
      setPostResponse(response.data);
    })();
  }, []);

  useEffect(() => {
    const { wallets } = postResponse || {};
    setWalletsList(wallets);
  }, [postResponse]);

  /* const router = useRouter();
  //email below is hardcoded for testing purposes
  const userWalletsFromServer = api.wallet.getWalletsWithEmail.useQuery(
    { email: "samko1311@gmail.com" },
    {
      enabled: true,
    }
  );
  const walletsList = userWalletsFromServer.data?.wallets;*/

  // console.log(walletsList);

  // if (true) return <LoadingScreen />;

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
                    <BackIcon />
                    My settings
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      {/* <Navbar>
        <h1>SplitWallet</h1>
        <BurgerButton>
          <BurgerIcon />
        </BurgerButton>
        
  </Navbar>*/}
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
          <IonFabButton onClick={() => history.push('/newWallet')}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}
