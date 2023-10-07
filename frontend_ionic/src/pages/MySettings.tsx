import React, { useContext, useEffect, useState } from 'react';
import { BurgerButton } from '../styles/buttons.styled';
import {
  TopPannel,
  MiddleSettingsPannel,
  BottomContent,
} from '../styles/mainContainers.styled';
import BackIcon from '-!svg-react-loader!../assets/icons/back.svg';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { Button } from '../styles/DropDownMenu.styled';
import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import axios from 'axios';
import { useQueryParams } from '../hooks/useQueryParams';
import { useUser } from '../lib/UserContext';

export default function MySettings() {
  const { user, setToken } = useUser();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState<string>(user ? user.name : '');
  const [nick, setNick] = useState<string>('');
  const [googleOauthUrl, setGoogleOauthUrl] = useState('');
  const { token: oauthToken } = useQueryParams();

  useEffect(() => {
    if (oauthToken) {
      setToken(oauthToken);
      navigate('/');
    }
  }, [oauthToken, setToken, navigate]);

  useEffect(() => {
    const loadOauthUrl = async () => {
      try {
        const response = await axios.get('/auth/google/url');
        const { url } = response.data;
        console.log('URL', url);
        setGoogleOauthUrl(url);
      } catch (e) {
        console.log(e);
      }
    };

    loadOauthUrl();
  }, []);

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  console.log('user', user);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>My settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {user && (
          <TopPannel>
            <IonAvatar>
              <img src={user.picture} alt="profile" />
            </IonAvatar>
            <p>Welcome {user.name}</p>
            <p>{user.email}</p>
          </TopPannel>
        )}

        <MiddleSettingsPannel>
          <IonList>
            <IonItem>
              <IonInput
                label="Full Name"
                labelPlacement="floating"
                maxlength={50}
                value={fullName}
                onIonChange={(e) => setFullName(e.detail.value as string)}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonInput
                label="Nickname"
                labelPlacement="floating"
                maxlength={50}
                value={nick}
                onIonChange={(e) => setNick(e.detail.value as string)}
              ></IonInput>
            </IonItem>
          </IonList>
          <p>Preferences</p>
        </MiddleSettingsPannel>
        <p>Notifications</p>

        <BottomContent>
          <Button
            disabled={!googleOauthUrl}
            onClick={() => {
              console.log('redirecting to google', googleOauthUrl);
              window.location.href = googleOauthUrl;
            }}
          >
            Sign With Google
          </Button>
          <Button onClick={logOut}>SignOut</Button>
        </BottomContent>
      </IonContent>
    </IonPage>
  );
}
