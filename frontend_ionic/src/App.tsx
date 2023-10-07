import React, { useState, useEffect } from 'react';
// import { Redirect, Route } from 'react-router-dom';
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

import { IonApp, IonRouterOutlet, IonTabs } from '@ionic/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { setupIonicReact } from '@ionic/react';
import { SQLiteHook, useSQLite } from 'react-sqlite-hook';

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
import { FrontendDBProvider } from './lib/FrontendDBContext';
import { UserProvider } from './lib/UserContext';

setupIonicReact();

function App() {
  return (
    <IonApp>
      <FrontendDBProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/:walletId/add" element={<Add />} />
              <Route path="/:walletId/edit" element={<EditWallet />} />
              <Route path="/:walletId/:walletItemId/edit" element={<Edit />} />
              <Route path="/:walletId/balances" element={<Balances />} />
              <Route path="/:walletId/expenses" element={<Expenses />} />
              <Route path="/:walletId/feed" element={<Feed />} />
              <Route path="/:walletId/:walletItemId/open" element={<Open />} />
              <Route path="/newWallet" element={<NewWallet />} />
              <Route path="/mysettings" element={<MySettings />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </FrontendDBProvider>
    </IonApp>
  );
}

export default App;
