import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
        <meta name="pragma" content="no-cache" />
        <meta name="expires" content="0" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'; 