import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { UserProvider } from "@/hooks/UserContext";
config.autoAddCss = false;
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </SessionProvider>
  );
}
