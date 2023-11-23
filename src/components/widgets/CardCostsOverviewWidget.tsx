// react
import { useMemo } from 'react';
// @mui
import { Box, Card, Typography, Avatar, Stack, Grid } from '@mui/material';
// utils
import { fPercent, fCurrency } from 'src/utils/formatNumber';

import { useQuery } from 'src/hooks/apollo';
import { GET_CARD_COSTS_OVERVIEW_WIDGET_DATA } from 'src/queries/widget';

// ----------------------------------------------------------------------

const cardInfo = {
  'amex': {
    label: 'American Express',
    icon: 'ic_amex.png',
  },
  'cb': {
    label: 'Cartes Bancaires',
    icon: 'ic_cb.jpg',
  },
  'dankort': {
    label: 'Dankort',
    icon: 'ic_dankort.svg',
  },
  'diners': {
    label: 'Diners',
    icon: 'ic_diners.svg',
  },
  'discover': {
    label: 'Discover',
    icon: 'ic_discover.svg',
  },
  'ec': {
    label: 'Electronic Cash',
    icon: 'ic_ec.svg',
  },
  'jcb': {
    label: 'JCB',
    icon: 'ic_jcb.svg',
  },
  'mastercard': {
    label: 'MasterCard',
    icon: 'ic_mastercard.svg',
  },
  'mobilepay': {
    label: 'MobilePay',
    icon: 'ic_mobilepay.png',
  },
  'paypal': {
    label: 'PayPal',
    icon: 'ic_paypal.svg',
  },
  'unionpay': {
    label: 'UnionPay',
    icon: 'ic_unionpay.svg',
  },
  'viabill': {
    label: 'ViaBill',
    icon: 'ic_viabill.png',
  },
  'visa': {
    label: 'VISA',
    icon: 'ic_visa.svg',
  },
  'visa_dk': {
    label: 'VISA Dankort',
    icon: 'ic_visa_dankort.png',
  },
  'visa_elec': {
    label: 'VISA Electron',
    icon: 'ic_visa_elec.svg',
  },
  'applepay': {
    label: 'Apple Pay',
    icon: 'ic_applepay.svg',
  },
  'googlepay': {
    label: 'Google Pay',
    icon: 'ic_googlepay.svg',
  },
};

function CardCost({ type, cost_pct, sub_brands }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, '& .MuiAvatar-img': { objectFit: 'contain' } }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h3" gutterBottom>
          {cost_pct ? fPercent(cost_pct, '.00') : '0%'}
        </Typography>
        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
          <Typography variant="subtitle2" component="div" noWrap>
            <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
              {cardInfo?.[type]?.label ?? type}
            </Box>
          </Typography>
        </Stack>
      </Box>
      <Avatar src={cardInfo[type]?.icon ? `/assets/icons/payments/${cardInfo[type]?.icon}` : null} sx={{ width: 120, height: 120 }}/>
    </Card>
  );
}

const CardCostsOverviewWidget = ({ merchantId, storeId, startPeriod, endPeriod, selectedPeriod }) => {


  const { data, loading } = useQuery(GET_CARD_COSTS_OVERVIEW_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  });
  
  if (loading || !data) return null;
  
  const cards = data.map((card) => {
    return (
      <Grid item xs={12} md={4}>
        <CardCost {...card} />
      </Grid>
    );
  });

  return cards;

};

export default CardCostsOverviewWidget;