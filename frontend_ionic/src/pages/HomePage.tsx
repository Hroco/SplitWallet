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
  IonContent,
  IonItem,
  IonList,
  IonPopover,
} from '@ionic/react';

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
  const [shouldShowBurgerMenu, setShouldShowBurgerMenu] = useState(false);

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
    <>
      <Navbar>
        <h1>SplitWallet</h1>
        <BurgerButton
          id="popover-button"
          onClick={() => setShouldShowBurgerMenu(true)}
        >
          <BurgerIcon />
        </BurgerButton>
        <IonPopover trigger="popover-button" dismissOnSelect={true}>
          <IonContent>
            <IonList>
              <IonItem
                button={true}
                detail={false}
                onClick={() => console.log(`/mysettings`)}
              >
                <BackIcon />
                My settings
              </IonItem>
              <IonItem button={true} detail={false}>
                Option 2
              </IonItem>
              <IonItem button={true} id="nested-trigger">
                More options...
              </IonItem>

              <IonPopover
                trigger="nested-trigger"
                dismissOnSelect={true}
                side="end"
              >
                <IonContent>
                  <IonList>
                    <IonItem button={true} detail={false}>
                      Nested option
                    </IonItem>
                    <IonItem button={true} detail={false}>
                      Nested option
                    </IonItem>
                    <IonItem button={true} detail={false}>
                      Nested option
                    </IonItem>
                  </IonList>
                </IonContent>
              </IonPopover>
            </IonList>
          </IonContent>
        </IonPopover>
        {/* shouldShowBurgerMenu && (
          <BurgerMenu
            isOpen={shouldShowBurgerMenu}
            setIsOpen={setShouldShowBurgerMenu}
          >
            <Button onClick={() => history.push(`/mysettings`)}>
              <BackIcon />
              My settings
            </Button>
          </BurgerMenu>
        )*/}
      </Navbar>
      <MainContent>
        {walletsList &&
          walletsList.map((item: any, index: number) => (
            <MainItem
              onClick={() => history.push(`/${item.id}/expenses`)}
              key={index}
              name={item.name}
              description={item.description}
            />
          ))}
      </MainContent>
      <WalletAddButton onClick={() => history.push('/newWallet')}>
        <AddIcon />
      </WalletAddButton>
    </>
  );
}
