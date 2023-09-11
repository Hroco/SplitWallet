import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewWallet from './pages/NewWallet';
import Add from './pages/Add';
import Balances from './pages/Balances';
import Expenses from './pages/Expenses';
import Feed from './pages/Feed';
import Open from './pages/Open';
import Edit from './pages/Edit';
import EditWallet from './pages/EditWallet';
import MySettings from './pages/MySettings';
import './styles/global.css';

import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { setupIonicReact } from '@ionic/react';

setupIonicReact();

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/:walletId/add">
            <Add />
          </Route>
          <Route exact path="/:walletId/edit">
            <EditWallet />
          </Route>
          <Route exact path="/:walletId/:walletItemId/edit">
            <Edit />
          </Route>
          <Route exact path="/:walletId/balances">
            <Balances />
          </Route>
          <Route exact path="/:walletId/expenses">
            <Expenses />
          </Route>
          <Route exact path="/:walletId/feed">
            <Feed />
          </Route>
          <Route exact path="/:walletId/:walletItemId/open">
            <Open />
          </Route>
          <Route exact path="/newWallet">
            <NewWallet />
          </Route>
          <Route exact path="/mysettings">
            <MySettings />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
