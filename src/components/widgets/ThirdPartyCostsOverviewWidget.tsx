// react
import { useMemo } from 'react';
// @mui
import { Box, Card, Typography, Avatar, Stack, Grid } from '@mui/material';
// utils
import { fPercent, fCurrency } from 'src/utils/formatNumber';

import { useQuery } from 'src/hooks/apollo';
import { GET_THIRD_PARTY_COSTS_OVERVIEW_WIDGET_DATA } from 'src/queries/widget';

// ----------------------------------------------------------------------

const thirdParties = {
  'mobilepay': {
    label: 'MobilePay',
    icon: 'ic_mobilepay.png',
  },
  'paypal': {
    label: 'PayPal',
    icon: 'ic_paypal.svg',
  },
  'viabill': {
    label: 'ViaBill',
    icon: 'ic_viabill.png',
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

function ThirdPartyCost({ type, cost_pct }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, '& .MuiAvatar-img': { objectFit: 'contain' } }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h3" gutterBottom>
          {cost_pct ? fPercent(cost_pct, '.00') : '0%'}
        </Typography>
        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
          <Typography variant="subtitle2" component="div" noWrap>
            <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
              {thirdParties?.[type]?.label ?? type}
            </Box>
          </Typography>
        </Stack>
      </Box>
      <Avatar src={thirdParties[type]?.icon ? `/assets/icons/payments/${thirdParties[type]?.icon}` : null} sx={{ width: 120, height: 120 }}/>
    </Card>
  );
}

const ThirdPartyCostsOverviewWidget = ({ merchantId, storeId, startPeriod, endPeriod, selectedPeriod }) => {

  const { data, loading } = useQuery(GET_THIRD_PARTY_COSTS_OVERVIEW_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  });
  
  if (loading || !data) return null;
  
  const thirdParties = data.map((thirdParty) => {
    return (
      <Grid item xs={12} md={4}>
        <ThirdPartyCost {...thirdParty} />
      </Grid>
    );
  });

  return thirdParties;

};

export default ThirdPartyCostsOverviewWidget;