import _mock from '../_mock';
import { randomNumberRange, randomInArray } from '../utils';

// ----------------------------------------------------------------------

export const _appRelated = ['Elavon', 'ReePay', 'Dinero'].map(
  (name, index) => ({
    id: _mock.id(index),
    name,
    status: name === 'Dinero' ? 'fejl' : 'aktiv',
    shortcut: '/assets/icons/apps/ic_github.svg',
  })
);

// ----------------------------------------------------------------------

export const _appInstalled = ['de', 'en', 'fr', 'kr', 'us'].map((country, index) => ({
  id: _mock.id(index),
  name: ['Germany', 'England', 'France', 'Korean', 'USA'][index],
  android: randomNumberRange(999, 99999),
  windows: randomNumberRange(999, 99999),
  apple: randomNumberRange(999, 99999),
  flag: `/assets/icons/flags/ic_flag_${country}.svg`,
}));

// ----------------------------------------------------------------------

export const _appAuthors = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  avatar: _mock.image.avatar(index),
  favourite: randomNumberRange(9999, 19999),
}));

// ----------------------------------------------------------------------

export const _appInvoices = [...Array(5)].map((_, index) => ({
  id: `${Date.now() + index}`,
  price: _mock.number.price(index),
  category: randomInArray(['Android', 'Mac', 'Windows']),
  status: randomInArray(['paid', 'out_of_date', 'in_progress']),
}));

// ----------------------------------------------------------------------

export const _appFeatured = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  title: [
    'Harry Potter and the Deathly Hallows - Part 2',
    'Disney Zombies 2',
    'Lightroom mobile - Koloro',
  ][index],
  description: _mock.text.title(index),
  image: _mock.image.cover(index),
}));
