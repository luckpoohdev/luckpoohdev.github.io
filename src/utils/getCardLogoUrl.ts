const cardLogoUrls = {
    'dankort': '/assets/icons/cards/dankort.svg',
    'diners': '/assets/icons/cards/diners.svg',
    'visa_dankort': '/assets/icons/cards/visa_dankort.png',
    'visa_dk': '/assets/icons/cards/visa_dankort.png',
    'discover': '/assets/icons/cards/diners.svg',
    'ec': '/assets/icons/cards/ec.svg',
    'visa': '/assets/icons/cards/visa.svg',
    'visa_elec': '/assets/icons/cards/visa_elec.svg',
    'jcb': '/assets/icons/cards/jcb.svg',
    'mastercard_dankort': '/assets/icons/cards/mastercard.svg',
    'unionpay': '/assets/icons/cards/unionpay.svg',
    'mastercard': '/assets/icons/cards/mastercard.svg',
    'mc': '/assets/icons/cards/mastercard.svg',
    'amex': '/assets/icons/cards/amex.svg',
    'cartes_bancaires': '/assets/icons/cards/cb.jpg',
  }
const getCardLogoUrl = (card) => cardLogoUrls[card];
export default getCardLogoUrl;