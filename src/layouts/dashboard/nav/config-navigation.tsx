// routes
import { PATH_APP } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import Icon from 'src/components/Icon';

// ----------------------------------------------------------------------

const ICONS = {
  blog: <Icon name="navbar/ic_blog" />,
  cart: <Icon name="navbar/ic_cart" />,
  chat: <Icon name="navbar/ic_chat" />,
  mail: <Icon name="navbar/ic_mail" />,
  user: <Icon name="navbar/ic_user" />,
  file: <Icon name="navbar/ic_file" />,
  lock: <Icon name="navbar/ic_lock" />,
  label: <Icon name="navbar/ic_label" />,
  blank: <Icon name="navbar/ic_blank" />,
  kanban: <Icon name="navbar/ic_kanban" />,
  folder: <Icon name="navbar/ic_folder" />,
  banking: <Icon name="navbar/ic_banking" />,
  booking: <Icon name="navbar/ic_booking" />,
  invoice: <Icon name="navbar/ic_invoice" />,
  calendar: <Icon name="navbar/ic_calendar" />,
  disabled: <Icon name="navbar/ic_disabled" />,
  external: <Icon name="navbar/ic_external" />,
  menuItem: <Icon name="navbar/ic_menu_item" />,
  ecommerce: <Icon name="navbar/ic_ecommerce" />,
  analytics: <Icon name="navbar/ic_analytics" />,
  dashboard: <Icon name="navbar/ic_dashboard" />,
  accounting: <Icon name="ic_book"  />,
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    items: [
      { title: 'dashboard', path: PATH_APP.dashboard.root, icon: ICONS.dashboard, children: [
          { title: 'overblik', path: PATH_APP.dashboard.overview },
          { title: 'salg', path: PATH_APP.dashboard.sales },
          { title: 'omkostninger', path: PATH_APP.dashboard.costs },
          { title: 'transaktioner', path: PATH_APP.dashboard.transactions },
          { title: 'KPI\'er', path: PATH_APP.dashboard.kpis },
        ],
      },
      { title: 'salgssteder', path: PATH_APP.stores.root, icon: ICONS.banking },
      { title: 'løsninger', path: PATH_APP.solutions.root, icon: ICONS.cart },
      { title: 'betalinger', path: PATH_APP.payments.root, icon: ICONS.invoice, children: [
        { title: 'salg', path: PATH_APP.payments.sales.root },
        { title: 'transaktioner', path: PATH_APP.payments.transactions.root },
        { title: 'afregninger', path: PATH_APP.payments.settlements.root },
      ] },
      { title: 'integrationer', path: PATH_APP.integrations.root, icon: ICONS.lock },
      { title: 'bogføring', path: PATH_APP.bookkeeping, icon: ICONS.accounting },
      /*{ title: 'tickets', path: PATH_APP.tickets.root, icon: ICONS.file, info: <Label color="error">+32</Label> },
      { title: 'organisation', path: PATH_APP.organization.root, icon: ICONS.user, children: [
        { title: 'brugere', path: PATH_APP.organization.users.root },
        { title: 'teams', path: PATH_APP.organization.teams.root },
        { title: 'roller', path: PATH_APP.organization.roles.root },
        { title: 'indstillinger', path: PATH_APP.organization.settings },
      ] },
      { title: 'hjælp', path: PATH_APP.help.root, icon: ICONS.chat, children: [
        { title: 'kontakt', path: PATH_APP.help.contact },
        { title: 'fejlrapportering', path: PATH_APP.help.bug_reports },
        { title: 'produktopdateringer', path: PATH_APP.help.roadmap },
        { title: 'hjælpecenter', path: 'https://advisoa.dk/help', info: <Icon name="ic_external" /> },
        { title: 'FAQ', path: 'https://advisoa.dk/faq', external: true, info: <Icon name="ic_external" /> },
      ] },*/
    ],
  },
];

export default navConfig;
