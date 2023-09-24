import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import GlobalStyles, { AppWrapper } from './styles/Global';
import App from './App';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import {
  defineCustomElements as jeepSqlite,
  applyPolyfills,
  JSX as LocalJSX,
} from 'jeep-sqlite/loader';
import { HTMLAttributes } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { SQLiteHook, useSQLite } from 'react-sqlite-hook';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';

/* type StencilToReact<T> = {
  [P in keyof T]?: T[P] &
    Omit<HTMLAttributes<Element>, 'className'> & {
      class?: string;
    };
};

declare global {
  export namespace JSX {
    interface IntrinsicElements
      extends StencilToReact<LocalJSX.IntrinsicElements> {}
  }
}*/

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const platform = Capacitor.getPlatform();

    // WEB SPECIFIC FUNCTIONALITY
    if (platform === 'web') {
      const sqlite = new SQLiteConnection(CapacitorSQLite);
      // Create the 'jeep-sqlite' Stencil component
      customElements.define('jeep-sqlite', JeepSqlite);
      const jeepSqliteEl = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepSqliteEl);
      await customElements.whenDefined('jeep-sqlite');
      console.log(`after customElements.whenDefined`);

      // Initialize the Web store
      await sqlite.initWebStore();
      console.log(`after initWebStore`);
    }

    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );

    const theme = {
      colors: {
        backgroundColorWhite: '#FFFFFF',
        backgroundColorDarkGrey: '#181818',
        backgroundColorLightGrey: '#1F1F1F',
        backgroundColorOrange: '#F09B59',
        fontColorOrange: '#F09B59',
        fontColorGreen: '#5DB075',
        fontColorBlue: '#5D9DB0',
        mainFontColor: '#FFFFFF',
        bilanceRedColor: '#925B4E',
        bilanceGreenColor: '#567D5A',
      },
      mobile: '768px',
      navbarHeight: '60px',
      expenseFooterHeight: '80px',
      feedFooterHeight: '60px',
      openFooterHeight: '60px',
      balanceBarHeight: 50,
    };

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
    // serviceWorkerRegistration.unregister();

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  } catch (err) {
    console.log(`Error: ${err}`);
    throw new Error(`Error: ${err}`);
  }
});
