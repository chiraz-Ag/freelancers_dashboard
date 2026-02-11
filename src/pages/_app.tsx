// src/pages/_app.tsx
import "@/i18n";
import React from "react";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { CssBaseline } from "@mui/material";
import Header from "@/components/Header";
import ThemeSelector from "@/components/ThemeSelector";
import SideMenu from "@/components/SideMenu";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useRouter } from "next/router";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const router = useRouter();

  const isDataPage = router.pathname === "/dashboard/data";

  return (
    <ThemeProvider>
      <SessionProvider session={session}>
        <CssBaseline />
        <Header />
        {!isDataPage && <SideMenu />}

        {/* Contenu principal */}
        <div style={{ padding: 0 }}>
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default App;
