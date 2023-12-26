/* eslint-disable import/no-webpack-loader-syntax */
import React, { useEffect, useState } from "react";
import {
  BurgerButton,
  NavigationNextItemButton,
  NavigationPrevItemButton,
} from "../styles/buttons.styled";
import {
  MiddlePannel,
  Navbar,
  OpenFooter,
  OpenMainContent,
} from "../styles/mainContainers.styled";
import TrashIcon from "-!svg-react-loader!../assets/icons/trash.svg";
import EditIcon from "-!svg-react-loader!../assets/icons/edit.svg";
import BackIcon from "-!svg-react-loader!../assets/icons/back.svg";
import { useLocation, useParams, useHistory } from "react-router-dom";
// import axios from 'axios';
import MainItem from "../components/MainItem";
import LoadingScreen from "../components/LoadingScreen";
import {
  ImageIconMenu,
  SecondaryItemMenu,
  ThirdItemMenu,
} from "../styles/Open.styled";
import CameraIcon from "-!svg-react-loader!../assets/icons/camera.svg";
import { ArrowRight } from "../styles/utills.styled";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { useDBFunctions } from "../lib/FrontendDBContext";

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear(); // Get year

  return `${day}/${month}/${year}`;
}

type RouteParams = {
  walletId?: string;
  walletItemId?: string;
};

export default function Open() {
  const { walletId, walletItemId } = useParams<RouteParams>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sortType = searchParams.get("sort") || "DateDesc";
  // console.log('sortType', sortType);
  const history = useHistory();
  const [walletItem, setWalletItem] = useState<any>(null);
  const [presentAlert] = useIonAlert();
  const [currentWalletUser, setCurrentWalletUser] = useState<any>(null);
  const [prevWalletItem, setPrevWalletItem] = useState<any>(null);
  const [nextWalletItem, setNextWalletItem] = useState<any>(null);
  const {
    getWalletItemByWalletItemId,
    getWalletUserByEmailAndWalletId,
    getPrevAndNextWalletItemByWalletItemIdAndSortType,
    deleteWalletItemById,
    initialized,
  } = useDBFunctions();

  useEffect(() => {
    if (!initialized) return;
    (async () => {
      const walletItem = await getWalletItemByWalletItemId(walletItemId || "");
      const walletUser = await getWalletUserByEmailAndWalletId(
        "samko1311@gmail.com",
        walletId || ""
      );

      const { walletItemPrev, walletItemNext } =
        await getPrevAndNextWalletItemByWalletItemIdAndSortType(
          walletItemId || "",
          sortType
        );

      console.log("open useEffect", {
        walletItem,
        walletUser,
        walletItemPrev,
        walletItemNext,
      });

      walletItem != undefined && setWalletItem(walletItem);
      walletUser != undefined && setCurrentWalletUser(walletUser);
      walletItemPrev != undefined && setPrevWalletItem(walletItemPrev);
      walletItemNext != undefined && setNextWalletItem(walletItemNext);
    })();
  }, [walletItemId, initialized]);

  if (walletItem == undefined) {
    // console.log('LoadingScreen because walletItem', walletItem);
    return <LoadingScreen />;
  }

  if (currentWalletUser == undefined) {
    // console.log('LoadingScreen because currentWalletUser', currentWalletUser);
    return <LoadingScreen />;
  }

  const isCurrentUserOneOfRecievers = walletItem.recievers.some(
    (reciever: any) => reciever.reciever.id == currentWalletUser.id
  );

  async function deleteWalletItem() {
    // axios.delete(`/api/wallets/deleteWalletItemById/${walletItemId}`);
    await deleteWalletItemById(walletItemId || "");
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
            <IonMenuButton autoHide={false} id="open-popover"></IonMenuButton>
            <IonPopover trigger="open-popover" dismissOnSelect={true}>
              <IonContent>
                <IonList>
                  <IonItem
                    button={true}
                    detail={false}
                    onClick={() =>
                      history.push(`/${walletId}/${walletItemId}/edit`)
                    }
                  >
                    <EditIcon />
                    <IonTitle>Edit</IonTitle>
                  </IonItem>
                  <IonItem
                    button={true}
                    detail={false}
                    onClick={() =>
                      presentAlert({
                        header: "Confirm delete?",
                        buttons: [
                          {
                            text: "CANCEL",
                            role: "cancel",
                            handler: () => {
                              console.log("Alert canceled");
                            },
                          },
                          {
                            text: "DELETE",
                            role: "delete",
                            handler: () => {
                              deleteWalletItem();
                            },
                          },
                        ],
                      })
                    }
                  >
                    <TrashIcon />
                    <IonTitle>Delete</IonTitle>
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPopover>
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
          For {walletItem.recievers.length} participants,{" "}
          {isCurrentUserOneOfRecievers ? "including me" : "but not me"}
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
