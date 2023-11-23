import numeral from 'numeral';

// ----------------------------------------------------------------------

// load a locale
if (numeral.locales['dk'] === undefined) {
  numeral.register('locale', 'dk', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal : function (number) {
        return '.'
    },
    currency: {
        symbol: 'DKK'
    }
  });
}

// switch between locales
numeral.locale('dk');

// ------------------------------------------------------------------------

type InputValue = string | number | null;

export function fNumber(number: InputValue) {
  return numeral(number).format();
}

export function fCurrency(number: InputValue, currency = 'DKK') {
  if (!currency) currency = 'DKK';
  const format = numeral(number).format('0,0.00');

  return `${result(format, ',00').replace(',00', '')} ${currency.toUpperCase()}`;
}

export function fPercent(number: InputValue, key = '.0') {
  const format = number ? numeral(Number(number) / 100).format(`0${key}%`) : '';

  return result(format, key).replace(/(,[0-9])0/, '$1').replace(key.replace('.', ','), '')
}

export function fShortenNumber(number: InputValue) {
  if (number === null || number === '') {
    return '';
  }

  // Determine if the number is a whole number
  const isWholeNumber = Number.isInteger(Number(number));

  // If the number is between 1000 and 9999, use one decimal point
  const shouldUseDecimal = Number(number) >= 1000 && Number(number) < 10000;

  // Determine the appropriate format
  let format;
  if (isWholeNumber) {
    format = shouldUseDecimal ? numeral(number).format('0.0a') : numeral(number).format('0a');
  } else {
    format = numeral(number).format('0.0a');
  }

  // Remove any trailing .0 after the decimal and replace comma with period
  return format.replace('.0k', 'k').replace('.0m', 'm').replace(',', '.');
}



export function fData(number: InputValue) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format: string, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
