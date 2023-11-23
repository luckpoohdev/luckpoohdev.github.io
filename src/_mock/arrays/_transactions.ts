import { add, subDays } from 'date-fns';
//
import _mock from '../_mock';
import { randomInArray, randomNumberRange } from '../utils';

// ----------------------------------------------------------------------

export const _transactions = [...Array(20)].map((_, index) => {
  return {
    id: index+1,
    transactionNumber: index,
    amount: _mock.number.price(index + 1),
    fee: _mock.number.price(index + 1),
    dataSource: randomInArray(['elavon', 'reepay', 'shopify', 'swedbank_pay']),
    paymentMethod: randomInArray(['mobilepay', 'visa_debet', 'mastercard_credit', 'mastercard_debet']),
    type: randomInArray(['payout', 'transaction', 'authorization', 'refund', 'error', 'abandonment']),
    status: randomInArray(['completed', 'reserved', 'failed', 'returned', 'created']),
    inBooks: randomInArray([true,false]),
    processedAt: subDays(new Date(), index),
  }
});

