export default function Head() {
  return (
    <>
      <title>Calorie Chat AI</title>
      <meta name="description" content="Умный помощник для подсчета калорий" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
      <meta name="pragma" content="no-cache" />
      <meta name="expires" content="0" />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}

// Отключаем статическую генерацию
export const dynamic = 'force-dynamic'; 