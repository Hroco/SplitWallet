/* eslint-disable import/no-webpack-loader-syntax */
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import contentData from "../assets/testContentData";
import ExpenseItem from "../components/ExpenseItem";
import { TotalExpenseDiv, MenuHeading } from "../styles/MainItemPage.styled";
import {
  WalletItemAddButton,
  BurgerButton,
  ExpenseButton,
} from "../styles/buttons.styled";
import {
  ExpenseMainContent,
  Navbar,
  ExpenseFooter,
} from "../styles/mainContainers.styled";
import AddIcon from "-!svg-react-loader!../assets/icons/addPlus.svg";
import BurgerIcon from "-!svg-react-loader!../assets/icons/hamburger.svg";
import BackIcon from "-!svg-react-loader!../assets/icons/back.svg";
import HistoryIcon from "-!svg-react-loader!../assets/icons/history.svg";
import TrashIcon from "-!svg-react-loader!../assets/icons/trash.svg";
import EditIcon from "-!svg-react-loader!../assets/icons/edit.svg";
import BurgerMenu from "../components/DropDownMenu";
// import axios from 'axios';
import LoadingScreen from "../components/LoadingScreen";
import { Button } from "../styles/DropDownMenu.styled";
import { ArrowDown, ArrowUp } from "../styles/utills.styled";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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

enum SortType {
  DateAsc = "DateAsc",
  DateDesc = "DateDesc",
  AmountAsc = "AmountAsc",
  AmountDesc = "AmountDesc",
  TitleAsc = "TitleAsc",
  TitleDesc = "TitleDesc",
  PayerAsc = "PayerAsc",
  PayerDesc = "PayerDesc",
  CategoryAsc = "CategoryAsc",
  CategoryDesc = "CategoryDesc",
}

export default function Expenses() {
  const { walletId } = useParams<{ walletId: string }>();
  const history = useHistory();
  // line bellow neads to be handled properly in the future
  const [sortType, setSortType] = useState<SortType>(SortType.DateDesc);
  // const [walletItems, setWalletItems] = useState<any[] | null>(null);
  // const [wallet, setWallet] = useState<any>(null);
  // const [currentWalletUser, setCurrentWalletUser] = useState<any>(null);
  const [presentAlert] = useIonAlert();
  if (walletId === undefined) throw new Error("WalletId is undefined.");
  if (typeof walletId != "string") throw new Error("WalletId is not string.");
  const {
    deleteWalletById,
    setWalletId,
    currentWalletUser,
    currentWallet,
    currentWalletItems,
    setCurrentWalletItems,
  } = useDBFunctions();

  useEffect(() => {
    setWalletId(walletId);
  }, []);

  /* useIonViewWillEnter(() => {
    console.log('ionViewWillEnter event fired');
    (async () => {
      const id = walletId;
      const response = await axios.get(
        `/api/wallets/getWalletItemsByWalletId/${id}`
      );
      setPostResponse(response.data);
    })();

    (async () => {
      const data = ['samko1311@gmail.com', walletId];
      const response = await axios.get(
        `/api/wallets/getWalletUserByEmailAndWalletId/${data}`
      );
      setPostResponse2(response.data);
    })();
  });*/

  /* useEffect(() => {
    (async () => {
      const id = walletId;
      const response = await axios.get(
        `/api/wallets/getWalletItemsByWalletId/${id}`
      );
      setPostResponse(response.data);
    })();
  }, []);*/

  /* useEffect(() => {
    const { wallet, walletItems } = postResponse || {};
    // console.log('wallet', wallet);
    if (walletItems == undefined) return;
    walletItems.sort((a: any, b: any) => {
      switch (sortType) {
        case SortType.DateAsc:
          return a.date > b.date ? 1 : -1;
        case SortType.DateDesc:
          return a.date < b.date ? 1 : -1;
        case SortType.AmountAsc:
          return a.amount > b.amount ? 1 : -1;
        case SortType.AmountDesc:
          return a.amount < b.amount ? 1 : -1;
        case SortType.TitleAsc:
          return a.name > b.name ? 1 : -1;
        case SortType.TitleDesc:
          return a.name < b.name ? 1 : -1;
        case SortType.PayerAsc:
          return a.payer.name > b.payer.name ? 1 : -1;
        case SortType.PayerDesc:
          return a.payer.name < b.payer.name ? 1 : -1;
        case SortType.CategoryAsc:
          return a.type > b.type ? 1 : -1;
        case SortType.CategoryDesc:
          return a.type < b.type ? 1 : -1;
        default:
          return 0;
      }
    });
    console.log('walletItems', walletItems);
    setWalletItems(walletItems);
    setWallet(wallet);
  }, [postResponse]);*/

  /* useEffect(() => {
    (async () => {
      const data = ['samko1311@gmail.com', walletId];
      const response = await axios.get(
        `/api/wallets/getWalletUserByEmailAndWalletId/${data}`
      );
      setPostResponse2(response.data);
    })();
  }, []);*/

  useEffect(() => {
    if (currentWalletItems == undefined) return;
    currentWalletItems.sort((a: any, b: any) => {
      switch (sortType) {
        case SortType.DateAsc:
          return a.date > b.date ? 1 : -1;
        case SortType.DateDesc:
          return a.date < b.date ? 1 : -1;
        case SortType.AmountAsc:
          return a.amount > b.amount ? 1 : -1;
        case SortType.AmountDesc:
          return a.amount < b.amount ? 1 : -1;
        case SortType.TitleAsc:
          return a.name > b.name ? 1 : -1;
        case SortType.TitleDesc:
          return a.name < b.name ? 1 : -1;
        case SortType.PayerAsc:
          return a.payer.name > b.payer.name ? 1 : -1;
        case SortType.PayerDesc:
          return a.payer.name < b.payer.name ? 1 : -1;
        case SortType.CategoryAsc:
          return a.type > b.type ? 1 : -1;
        case SortType.CategoryDesc:
          return a.type < b.type ? 1 : -1;
        default:
          return 0;
      }
    });
    // setShouldShowBurgerMenu(false);
    setCurrentWalletItems([...currentWalletItems]);
  }, [sortType]);

  /* useEffect(() => {
    const { walletUser } = postResponse2 || {};
    // console.log('walletUser', walletUser);
    setCurrentWalletUser(walletUser);
  }, [postResponse2]);*/

  // console.log('walletItems', walletItems);
  // console.log('currentWalletUser', currentWalletUser);

  async function deleteWallet() {
    // axios.delete(`/api/wallets/deleteWalletById/${walletId}`);
    await deleteWalletById(walletId || "");
    history.push("/");
  }

  function getIcon(buttonType: string, sortType: SortType) {
    if (
      buttonType == "amount" &&
      sortType != SortType.AmountAsc &&
      sortType != SortType.AmountDesc
    ) {
      return <h1> </h1>;
    }

    if (
      buttonType == "title" &&
      sortType != SortType.TitleAsc &&
      sortType != SortType.TitleDesc
    ) {
      return <h1> </h1>;
    }

    if (
      buttonType == "date" &&
      sortType != SortType.DateAsc &&
      sortType != SortType.DateDesc
    ) {
      return <h1> </h1>;
    }

    if (
      buttonType == "payer" &&
      sortType != SortType.PayerAsc &&
      sortType != SortType.PayerDesc
    ) {
      return <h1> </h1>;
    }

    if (
      buttonType == "category" &&
      sortType != SortType.CategoryAsc &&
      sortType != SortType.CategoryDesc
    ) {
      return <h1> </h1>;
    }

    switch (sortType) {
      case SortType.DateAsc:
        return (
          <ArrowUp>
            <BackIcon />
          </ArrowUp>
        );
      case SortType.DateDesc:
        return (
          <ArrowDown>
            <BackIcon />
          </ArrowDown>
        );
      case SortType.AmountAsc:
        return (
          <ArrowUp>
            <BackIcon />
          </ArrowUp>
        );
      case SortType.AmountDesc:
        return (
          <ArrowDown>
            <BackIcon />
          </ArrowDown>
        );
      case SortType.TitleAsc:
        return (
          <ArrowUp>
            <BackIcon />
          </ArrowUp>
        );
      case SortType.TitleDesc:
        return (
          <ArrowDown>
            <BackIcon />
          </ArrowDown>
        );
      case SortType.PayerAsc:
        return (
          <ArrowUp>
            <BackIcon />
          </ArrowUp>
        );
      case SortType.PayerDesc:
        return (
          <ArrowDown>
            <BackIcon />
          </ArrowDown>
        );
      case SortType.CategoryAsc:
        return (
          <ArrowUp>
            <BackIcon />
          </ArrowUp>
        );
      case SortType.CategoryDesc:
        return (
          <ArrowDown>
            <BackIcon />
          </ArrowDown>
        );
      default:
        return (
          <ArrowUp>
            <BackIcon />
          </ArrowUp>
        );
    }
  }

  function toggleSortType(asc: SortType, desc: SortType) {
    if (sortType === asc) {
      setSortType(desc);
    } else {
      setSortType(asc);
    }
  }

  if (!currentWallet || currentWallet === undefined) return <LoadingScreen />;
  if (!currentWalletUser || currentWalletUser === undefined)
    return <LoadingScreen />;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>{currentWallet.name}</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton
              autoHide={false}
              id="expense-popover"
            ></IonMenuButton>
            <IonPopover trigger="expense-popover" dismissOnSelect={true}>
              <IonContent>
                <IonList>
                  <IonItem
                    button={true}
                    detail={false}
                    onClick={() => history.push(`/${walletId}/edit`)}
                  >
                    <EditIcon />
                    <IonTitle>Edit</IonTitle>
                  </IonItem>
                  <IonItem button={true} detail={true} id="nested-trigger">
                    <BackIcon />
                    <IonTitle>Sort</IonTitle>
                  </IonItem>

                  <IonPopover
                    trigger="nested-trigger"
                    dismissOnSelect={false}
                    side="end"
                  >
                    <IonContent>
                      <IonList>
                        <IonItem button={false} detail={false}>
                          <MenuHeading>Sort by</MenuHeading>
                        </IonItem>
                        <IonItem
                          button={true}
                          detail={false}
                          onClick={() =>
                            toggleSortType(
                              SortType.TitleAsc,
                              SortType.TitleDesc
                            )
                          }
                        >
                          {getIcon("title", sortType)} Title
                        </IonItem>
                        <IonItem
                          button={true}
                          detail={false}
                          onClick={() =>
                            toggleSortType(
                              SortType.AmountAsc,
                              SortType.AmountDesc
                            )
                          }
                        >
                          {getIcon("amount", sortType)} Amount
                        </IonItem>
                        <IonItem
                          button={true}
                          detail={false}
                          onClick={() =>
                            toggleSortType(SortType.DateAsc, SortType.DateDesc)
                          }
                        >
                          {getIcon("date", sortType)} Expense date
                        </IonItem>
                        <IonItem
                          button={true}
                          detail={false}
                          onClick={() =>
                            toggleSortType(
                              SortType.PayerAsc,
                              SortType.PayerDesc
                            )
                          }
                        >
                          {getIcon("payer", sortType)} Payer
                        </IonItem>
                        <IonItem
                          button={true}
                          detail={false}
                          onClick={() =>
                            toggleSortType(
                              SortType.CategoryAsc,
                              SortType.CategoryDesc
                            )
                          }
                        >
                          {getIcon("category", sortType)} Category
                        </IonItem>
                      </IonList>
                    </IonContent>
                  </IonPopover>
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
                              deleteWallet();
                            },
                          },
                        ],
                      })
                    }
                  >
                    <TrashIcon />
                    <IonTitle>Delete</IonTitle>
                  </IonItem>
                  <IonItem
                    button={true}
                    detail={false}
                    onClick={() => history.push(`/${walletId}/feed`)}
                  >
                    <HistoryIcon />
                    <IonTitle>History</IonTitle>
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <Navbar>
        <ExpenseButton
          onClick={() => history.push(`/${walletId}/expenses`)}
          data-test-target="expenseButton"
        >
          <h1>MY EXPENSES</h1>
        </ExpenseButton>
        <ExpenseButton
          onClick={() => history.push(`/${walletId}/balances`)}
          data-test-target="balancesButton"
        >
          <h1>BALANCES</h1>
        </ExpenseButton>
      </Navbar>
      <IonContent>
        <IonList>
          {currentWalletItems &&
            currentWalletItems.map((walletItem: any, index: number) => (
              <ExpenseItem
                onClick={() =>
                  history.push(
                    `/${walletId}/${walletItem.id}/open?sort=${sortType}`
                  )
                }
                key={index}
                name={walletItem.name}
                payer={walletItem.payer.name}
                price={walletItem.amount}
                date={walletItem.date}
                type={walletItem.type}
              />
            ))}
        </IonList>
      </IonContent>
      <ExpenseFooter>
        <div>
          <p>MY TOTAL</p>
          <h2 data-test-target="currentUserTotal">
            € {currentWalletUser.total.toFixed(2)}
          </h2>
        </div>
        <WalletItemAddButton
          onClick={() => history.push(`/${walletId}/add`)}
          data-test-target="addItemButton"
        >
          <AddIcon />
        </WalletItemAddButton>
        <TotalExpenseDiv>
          <p>TOTAL EXPENSES</p>
          <h2 data-test-target="walletTotal">
            € {currentWallet.total.toFixed(2)}
          </h2>
        </TotalExpenseDiv>
      </ExpenseFooter>
    </IonPage>
  );
}
