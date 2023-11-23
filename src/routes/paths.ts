// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_APP = '/';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  maintenance: '/maintenance',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
};

export const PATH_APP = {
  root: ROOTS_APP,
  dashboard: {
    root: path(ROOTS_APP, 'dashboard'),
    overview: path(ROOTS_APP, 'dashboard/overview'),
    sales: path(ROOTS_APP, 'dashboard/sales'),
    costs: path(ROOTS_APP, 'dashboard/costs'),
    transactions: path(ROOTS_APP, 'dashboard/transactions'),
    kpis: path(ROOTS_APP, 'dashboard/kpis'),
  },
  stores: {
    root: path(ROOTS_APP, 'stores'),
    view: (id: string) => path(PATH_APP.stores.root, `/${id}`)
  },
  solutions: {
    root: path(ROOTS_APP, 'solutions'),
    view: (id: string) => path(PATH_APP.solutions.root, `/${id}`)
  },
  payments: {
    root: path(ROOTS_APP, 'payments'),
    sales: {
      root: path(ROOTS_APP, 'payments/sales'),
      view: (id: string) => path(PATH_APP.payments.sales.root, `/${id}`),
    },
    transactions: {
      root: path(ROOTS_APP, 'payments/transactions'),
      view: (id: string) => path(PATH_APP.payments.transactions.root, `/${id}`),
    },
    settlements: {
      root: path(ROOTS_APP, 'payments/settlements'),
      view: (id: string) => path(PATH_APP.payments.settlements.root, `/${id}`),
    }
  },
  integrations: {
    root: path(ROOTS_APP, 'integrations'),
    view: (id: string) => path(PATH_APP.integrations.root, `/${id}`),
  },
  bookkeeping: path(ROOTS_APP, 'bookkeeping'),
  tickets: {
    root: path(ROOTS_APP, 'tickets'),
    create: () => path(PATH_APP.tickets.root, '/create'),
  },
  organization: {
    root: path(ROOTS_APP, 'organization'),
    users: {
      root: path(ROOTS_APP, 'organization/users'),
      create: () => path(PATH_APP.organization.users.root, '/create'),
      edit: (id) => path(PATH_APP.organization.users.root, `/${id}/#tab=edit`),
      view: (id) => path(PATH_APP.organization.users.root, `/${id}`),
    },
    teams: {
      root: path(ROOTS_APP, 'organization/teams'),
      create: () => path(PATH_APP.organization.teams.root, '/create'),
      view: (id) => path(PATH_APP.organization.teams.root, `/${id}`),
    },
    roles: {
      root: path(ROOTS_APP, 'organization/roles'),
      create: () => path(PATH_APP.organization.roles.root, '/create'),
      view: (id) => path(PATH_APP.organization.roles.root, `/${id}`),
      edit: (id) => path(PATH_APP.organization.roles.root, `/${id}/edit`),
    },
    settings: path(ROOTS_APP, 'organization/settings'),
  },
  help: {
    root: path(ROOTS_APP, 'help'),
    contact: path(ROOTS_APP, 'help/contact'),
    bug_reports: path(ROOTS_APP, 'help/bug-reports'),
    roadmap: path(ROOTS_APP, 'help/roadmap'),
  },
};

export const PATH_DOCS = {
  root: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
};