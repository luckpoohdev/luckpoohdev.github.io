// ----------------------------------------------------------------------

export type IMerchantType = {
  userMerchants: [] | [{
    name: string;
    vat_number: string;
    stores: [{ id: number, name: string }];
  }]
}