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

type StencilToReact<T> = {
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
}

applyPolyfills().then(() => {
  jeepSqlite(window);
});
window.addEventListener('DOMContentLoaded', async () => {
  console.log('$$$ in index $$$');
  const platform = Capacitor.getPlatform();
  const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  try {
    if (platform === 'web') {
      const jeepEl = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepEl);
      await customElements.whenDefined('jeep-sqlite');
      await sqlite.initWebStore();
    }
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection('db_issue9', false)).result;
    let db: SQLiteDBConnection;
    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection('db_issue9', false);
    } else {
      db = await sqlite.createConnection(
        'db_issue9',
        false,
        'no-encryption',
        1,
        false
      );
    }

    await db.open();
    const query = `
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
    `;

    const res: any = await db.execute(query);
    console.log(`res: ${JSON.stringify(res)}`);
    await db.close();
    await sqlite.closeConnection('db_issue9', false);

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
