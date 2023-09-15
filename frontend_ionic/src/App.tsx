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

import { IonApp, IonRouterOutlet, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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

interface JsonListenerInterface {
  jsonListeners: boolean;
  setJsonListeners: React.Dispatch<React.SetStateAction<boolean>>;
}
interface existingConnInterface {
  existConn: boolean;
  setExistConn: React.Dispatch<React.SetStateAction<boolean>>;
}

// Singleton SQLite Hook
export let sqlite: SQLiteHook;
// Existing Connections Store
export let existingConn: existingConnInterface;
// Is Json Listeners used
export let isJsonListeners: JsonListenerInterface;

setupIonicReact();

function App() {
  const [existConn, setExistConn] = useState(false);
  existingConn = { existConn: existConn, setExistConn: setExistConn };

  // !!!!! if you do not want to use the progress events !!!!!
  // since react-sqlite-hook 2.1.0
  // sqlite = useSQLite()
  // before
  // sqlite = useSQLite({})
  // !!!!!                                               !!!!!

  sqlite = useSQLite();
  console.log(`$$$ in App sqlite.isAvailable  ${sqlite.isAvailable} $$$`);

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
