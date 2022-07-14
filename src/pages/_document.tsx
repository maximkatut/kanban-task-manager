import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script id="dark-mode" strategy="lazyOnload">
          {`if (localStorage.getItem(' ') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark')
          }`}
        </Script>
      </Head>
      <body className="dark:text-white dark:bg-grey-very-dark">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
