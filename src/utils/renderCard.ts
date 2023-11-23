const RenderCard = (cardType, subBrand) => {
    switch (cardType) {
      case 'visa_elec': cardType = 'VISA Electron'; break;
      case 'visa_dk': cardType = 'VISA Dankort'; break;
      case 'visa': cardType = 'VISA'; break;
      case 'mc': cardType = 'Mastercard'; break;
      case 'mastercard': cardType = 'Mastercard'; break;
    }
    switch (subBrand) {
      case 'consumer': subBrand = ''; break;
      case 'consumer_debit': subBrand = 'consumer debit'; break;
      case 'consumer_credit': subBrand = 'consumer credit'; break;
      case 'business_debit': subBrand = 'business debit'; break;
      case 'business_credit': subBrand = 'business credit'; break;
      case 'corporate_debit': subBrand = 'corporate debit'; break;
      case 'corporate_credit': subBrand = 'corporate credit'; break;
    }
    return `${cardType} ${subBrand}`;
  }
  export default RenderCard;