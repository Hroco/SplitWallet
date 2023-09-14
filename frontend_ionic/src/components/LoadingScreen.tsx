import React from 'react';
import {
  LoadingDiv,
  LoadingScreenWrapper,
} from '../styles/LoadingScreen.styled';
import { IonPage } from '@ionic/react';

export default function LoadingScreen() {
  return (
    <IonPage>
      <LoadingScreenWrapper>
        <LoadingDiv>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </LoadingDiv>
      </LoadingScreenWrapper>
    </IonPage>
  );
}
