// routes
import { PATH_APP } from './routes/paths';

// Naming
export const TRANSACTION_TYPES = {
  'initialization': 'initialisering',
  'authorization': 'autorisering',
  'settlement': 'hævning',
  'payout': 'udbetaling',
  'refund': 'refundering',
  'return': 'tilbagebetaling',

  'initialized': 'initialiseret',
  'authorized': 'autoriseret',
  'settled': 'hævet',
  'paid': 'udbetalt',
  'refunded': 'refunderet',
  'returned': 'tilbagebetalt',
}
export const TRANSACTION_TYPE_COLORS = {
  'initialization':  'default',
  'authorization':  'info',
  'settlement': 'success',
  'payout': 'success',
  'refund': 'error',
  'return': 'error',

  'initialized':  'default',
  'authorized':  'info',
  'settled': 'success',
  'paid': 'success',
  'refunded': 'error',
  'returned': 'error',
}
export const TRANSACTION_STATUSES = {
  'completed': 'gennemført',
  'cancelled': 'annulleret',
  'failed': 'fejlet',
}
export const TRANSACTION_STATUS_COLORS = {
  'completed': 'success',
  'cancelled': 'warning',
  'failed': 'error',
}
export const SALE_STATUSES = {
  'preordered': 'forudbestilt',
  'draft': 'kladde',
  'pending': 'afventer',
  'processing': 'behandler',
  'waiting': 'pauset',
  'completed': 'gennemført',
  'cancelled': 'annulleret',
  'refunded': 'refunderet',
  'failed': 'fejlet',
}

export const SALE_STATUS_COLORS = {
  'paid': 'success',
  'pending': 'default',
  'processing': 'info',
  'on-hold': 'default',
  'completed': 'success',
  'cancelled': 'default',
  'refunded': 'error',
  'failed': 'error',
  'checkout-draft': 'kladde',
}

// API
// ----------------------------------------------------------------------

export const HOST_API_KEY = process.env.HOST_API_KEY || '';

export const FIREBASE_API = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export const COGNITO_API = {
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
};

export const AUTH0_API = {
  clientId: process.env.AUTH0_CLIENT_ID,
  domain: process.env.AUTH0_DOMAIN,
};

export const MAP_API = process.env.MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_APP.dashboard.overview;

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  H_MOBILE: 64,
  H_MAIN_DESKTOP: 88,
  H_DASHBOARD_DESKTOP: 92,
  H_DASHBOARD_DESKTOP_OFFSET: 92 - 32,
};

export const NAV = {
  W_BASE: 260,
  W_DASHBOARD: 280,
  W_DASHBOARD_MINI: 88,
  //
  H_DASHBOARD_ITEM: 48,
  H_DASHBOARD_ITEM_SUB: 36,
  //
  H_DASHBOARD_ITEM_HORIZONTAL: 32,
};

export const ICON = {
  NAV_ITEM: 24,
  NAV_ITEM_HORIZONTAL: 22,
  NAV_ITEM_MINI: 22,
};
