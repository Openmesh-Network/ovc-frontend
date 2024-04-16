import { RootContextProvider } from "@/context";
import { Layout } from "@/components/layout";
import AlertContainer from "@/components/alert/alert-container";
import { Manrope } from "next/font/google";
import "@aragon/ods/index.css";
import "@/pages/globals.css";
import Head from "next/head";
import { siteConfig } from "@/config/site";

const manrope = Manrope({
  subsets: ["latin"],
});

export default function AragonetteApp({ Component, pageProps }: any) {
  // const initialState = cookieToInitialState(config, headers().get('cookie'))

  return (
    <div className={manrope.className}>
      <Head>
        <title>{siteConfig.name}</title>
      </Head>
      <RootContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <AlertContainer />
      </RootContextProvider>
    </div>
  );
}
