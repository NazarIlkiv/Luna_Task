import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import MainLayout from "@/components/MainLayout";
import Homepage from "@/components/Homepage";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MainLayout className="wrapper">
        <Component {...pageProps} />
        <Homepage {...pageProps} />
      </MainLayout>
    </>
  );
}
