import "reflect-metadata";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  defineCustomElements as jeepSqlite,
  applyPolyfills,
  JSX as LocalJSX,
} from "jeep-sqlite/loader";
import { HTMLAttributes } from "react";
import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite } from "@capacitor-community/sqlite";

import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

import sqliteConnection from "./database";
import SplitWalletDataSource from "./data-sources/SplitWalletDataSource";
import { ThemeProvider } from "styled-components";
import GlobalStyles, { AppWrapper } from "./styles/Global";

type StencilToReact<T> = {
  [P in keyof T]?: T[P] &
    Omit<HTMLAttributes<Element>, "className"> & {
      class?: string;
    };
};

declare global {
  export namespace JSX {
    interface IntrinsicElements
      extends StencilToReact<LocalJSX.IntrinsicElements> {}
  }
}

applyPolyfills().then(() => {
  jeepSqlite(window);
});

const theme = {
  colors: {
    backgroundColorWhite: "#FFFFFF",
    backgroundColorDarkGrey: "#181818",
    backgroundColorLightGrey: "#1F1F1F",
    backgroundColorOrange: "#F09B59",
    fontColorOrange: "#F09B59",
    fontColorGreen: "#5DB075",
    fontColorBlue: "#5D9DB0",
    mainFontColor: "#FFFFFF",
    bilanceRedColor: "#925B4E",
    bilanceGreenColor: "#567D5A",
  },
  mobile: "768px",
  navbarHeight: "60px",
  expenseFooterHeight: "80px",
  feedFooterHeight: "60px",
  openFooterHeight: "60px",
  balanceBarHeight: 50,
};

window.addEventListener("DOMContentLoaded", async () => {
  const platform = Capacitor.getPlatform();

  try {
    if (platform === "web") {
      const jeepEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepEl);
      await customElements.whenDefined("jeep-sqlite");
      await sqliteConnection.initWebStore();
    }

    // when using Capacitor, you might want to close existing connections,
    // otherwise new connections will fail when using dev-live-reload
    // see https://github.com/capacitor-community/sqlite/issues/106
    await CapacitorSQLite.checkConnectionsConsistency({
      dbNames: [], // i.e. "i expect no connections to be open"
      openModes: [],
    }).catch((e) => {
      // the plugin throws an error when closing connections. we can ignore
      // that since it is expected behaviour
      console.log(e);
      return {};
    });

    for (const connection of [SplitWalletDataSource]) {
      if (!connection.isInitialized) {
        await connection.initialize();
      }

      await connection.runMigrations();
    }

    if (platform === "web") {
      // save the database from memory to store
      await sqliteConnection.saveToStore("ionic-react-split-wallet");
    }

    const container = document.getElementById("root");
    const root = createRoot(container!);
    root.render(
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <AppWrapper>
            <App />
          </AppWrapper>
        </ThemeProvider>
      </React.StrictMode>
    );

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://cra.link/PWA
    serviceWorkerRegistration.unregister();

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
  } catch (err) {
    console.log(`Error: ${err}`);
    throw new Error(`Error: ${err}`);
  }
});
