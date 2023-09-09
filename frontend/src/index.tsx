import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import GlobalStyles, { AppWrapper } from './styles/Global';
import App from './App';

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
  },
  mobile: '768px',
  navbarHeight: '60px',
  expenseFooterHeight: '80px',
  feedFooterHeight: '60px',
  openFooterHeight: '60px',
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
