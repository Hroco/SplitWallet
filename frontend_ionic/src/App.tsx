import React from "react";
import { Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import HomePage from "./pages/HomePage";
import NewWallet from "./pages/NewWallet";
import Add from "./pages/Add";
import Balances from "./pages/Balances";
import Expenses from "./pages/Expenses";
import Feed from "./pages/Feed";
import Open from "./pages/Open";
import Edit from "./pages/Edit";
import EditWallet from "./pages/EditWallet";
import MySettings from "./pages/MySettings";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { DBProvider } from "./lib/FrontendDBContext";
import { UserProvider } from "./lib/UserContext";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <DBProvider>
        <UserProvider>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/" component={HomePage} />
              <Route path="/:walletId/add" component={Add} />
              <Route path="/:walletId/edit" component={EditWallet} />
              <Route path="/:walletId/:walletItemId/edit" component={Edit} />
              <Route path="/:walletId/balances" component={Balances} />
              <Route path="/:walletId/expenses" component={Expenses} />
              <Route path="/:walletId/feed" component={Feed} />
              <Route path="/:walletId/:walletItemId/open" component={Open} />
              <Route path="/newWallet" component={NewWallet} />
              <Route path="/mysettings" component={MySettings} />
            </IonRouterOutlet>
          </IonReactRouter>
        </UserProvider>
      </DBProvider>
    </IonApp>
  );
};

/*function App() {
  return (
    <IonApp>
      <DBProvider>
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
      </DBProvider>
    </IonApp>
  );
}*/

export default App;
