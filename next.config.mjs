import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   typedRoutes: true,
  // },
  images: {
    remotePatterns: [
      { hostname: 'tokenkey.io' },
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 's.gravatar.com' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'jfszoxbakdximullyelp.supabase.co' },
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/img/:path*',
  //       headers: [
  //         { key: 'Access-Control-Allow-Credentials', value: 'true' },
  //         { key: 'Access-Control-Allow-Origin', value: '*' },
  //         { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
  //         {
  //           key: 'Access-Control-Allow-Headers',
  //           value:
  //             'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  //         },
  //       ],
  //     },
  //   ]
  // },
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908#issuecomment-1487801131
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  transpilePackages: ['geist'],
}

export default withNextIntl(nextConfig)
