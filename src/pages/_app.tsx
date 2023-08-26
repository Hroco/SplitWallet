import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "../styles/Global";
import Head from "next/head";

const theme = {
  colors: {
    backgroundColorDarkGrey: "#181818",
    backgroundColorLightGrey: "#1F1F1F",
    backgroundColorOrange: "#F09B59",
    mainFontColor: "#FFFFFF",
  },
  mobile: "768px",
  navbarHeight: "60px",
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Head>
        <title>SplitWallet</title>
        <meta
          name="description"
          content="Budgeting app for couples and roommates"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
