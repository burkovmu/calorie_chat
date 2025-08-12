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
  // Отключаем статическую генерацию для всех страниц
  output: 'standalone',
  
  // Улучшить стабильность разработки
  experimental: {
    optimizeCss: true,
    // Отключаем автоматическую оптимизацию
    workerThreads: false,
    cpus: 1,
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
    
    // Отключаем оптимизации, которые могут вызывать проблемы
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: false,
        runtimeChunk: false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig
