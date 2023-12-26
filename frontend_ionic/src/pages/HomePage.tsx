/* eslint-disable max-len */
import React, { useEffect, useState } from "react";
import { IonFabButtonOrange } from "../styles/buttons.styled";
import MainItem from "../components/MainItem";
import { useHistory } from "react-router-dom";
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
} from "@ionic/react";
import { add, settingsOutline } from "ionicons/icons";
import { useDBFunctions } from "../lib/FrontendDBContext";

export default function HomePage() {
  const history = useHistory();

  const { walletsList } = useDBFunctions();

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
                    data-test-target="mySettingsButton"
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
              data-test-target={"wallet" + index}
            />
          ))}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButtonOrange
            onClick={() => history.push("/newWallet")}
            data-test-target="addButton"
          >
            <IonIcon icon={add}></IonIcon>
          </IonFabButtonOrange>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}
