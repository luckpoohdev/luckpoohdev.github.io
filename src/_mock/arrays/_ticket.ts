import _mock from '../_mock';
import { randomNumberRange, randomInArray } from '../utils';

// ----------------------------------------------------------------------

export const _ticketList = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: _mock.image.avatar(index),
  creator: _mock.name.fullName(index),
  subject: _mock.text.title(index),
  category: randomInArray([ 'andet', 'aftaler', 'hjælp', 'forespørgsel' ]),
  priority: randomInArray([ 'akut', 'middel', 'lav' ]),
  status: randomInArray([ 'open', 'closed' ]),
}));
