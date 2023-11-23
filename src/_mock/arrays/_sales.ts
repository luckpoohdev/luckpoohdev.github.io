import { add, subDays } from 'date-fns';
//
import _mock from '../_mock';
import { randomInArray, randomNumberRange } from '../utils';

// ----------------------------------------------------------------------

const countries = {
  'dk': 'denmark',
  'de': 'germany',
  'us': 'usa',
  'fr': 'france',
  'se': 'sweden',
  'no': 'norway',
  'fi': 'finland',
}

export const _sales = [...Array(20)].map((_, index) => {
  const countryCode = randomInArray(['dk', 'de', 'us', 'fr', 'se', 'no', 'fi'])
  return {
    id: _mock.id(index),
    transactionNumber: index,
    amount: _mock.number.price(index + 1),
    createDate: subDays(new Date(), index),
    status: randomInArray(['completed', 'reserved', 'failed', 'returned']),
    country: countries[countryCode],
    countryCode,
    solutionId: randomInArray([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]),
    solutionName: 'FA Kortbetaling',
    inBooks: randomInArray([true,false]),
    paymentMethod: randomInArray(['mobilepay', 'visa_debet', 'mastercard_credit', 'mastercard_debet']),
  }
});

