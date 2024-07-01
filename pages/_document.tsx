import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/icon.svg" />
      </Head>
      <body className="bg-neutral-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
