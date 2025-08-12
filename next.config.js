/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
  // Игнорировать ошибки расширений браузера
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Улучшить стабильность разработки
  experimental: {
    optimizeCss: true,
  },
  // Игнорировать ошибки в консоли браузера от расширений
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.ignoreWarnings = [
        /Failed to connect to MetaMask/,
        /MetaMask extension not found/,
        /chrome-extension/,
      ];
    }
    return config;
  },
}

module.exports = nextConfig
