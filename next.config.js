module.exports = {
  swcMinify: false,
  trailingSlash: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  env: {
    // HOST
    HOST_API_KEY: 'https://dev.api.advisoa.dk',
    // MAPBOX
    MAPBOX_API: '',
    // FIREBASE
    FIREBASE_API_KEY: '',
    FIREBASE_AUTH_DOMAIN: '',
    FIREBASE_PROJECT_ID: '',
    FIREBASE_STORAGE_BUCKET: '',
    FIREBASE_MESSAGING_SENDER_ID: '',
    FIREBASE_APPID: '',
    FIREBASE_MEASUREMENT_ID: '',
    // AWS COGNITO
    AWS_COGNITO_USER_POOL_ID: '',
    AWS_COGNITO_CLIENT_ID: '',
    // AUTH0
    AUTH0_DOMAIN: '',
    AUTH0_CLIENT_ID: '',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  serverRuntimeConfig: {
    API_TOKEN: String(process.env.API_TOKEN).trim(),
  },
  publicRuntimeConfig: {
    TUNNEL_URL: String(process.env.NEXT_PUBLIC_TUNNEL_URL).trim(),
    BASE_URL: String(process.env.NEXT_PUBLIC_BASE_URL).trim(),
    API_URL: String(process.env.NEXT_PUBLIC_API_URL).trim(),
    LOCAL: process.env.NEXT_PUBLIC_LOCAL,
  },
};
