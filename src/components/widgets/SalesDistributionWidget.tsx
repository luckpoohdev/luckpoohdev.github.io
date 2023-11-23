// @mui
import { alpha } from '@mui/material/styles';
import { Grid, Card, CardHeader, Typography, Stack, LinearProgress, Box, CardProps } from '@mui/material';
// utils
import { fShortenNumber } from 'src/utils/formatNumber';

import { useQuery } from 'src/hooks/apollo';
import { GET_SALES_DISTRIBUTION_WIDGET_DATA } from 'src/queries/widget';

// ----------------------------------------------------------------------

const salesStatuses = {
  authorized: {
    label: 'Autoriseret',
    color: 'warning',
  },
  settled: {
    label: 'Hævet',
    color: 'primary',
  },
  paid: {
    label: 'Udbetalt',
    color: 'success',
  },
  refunded: {
    label: 'Refunderet',
    color: 'info',
  },
  returned: {
    label: 'Returneret',
    color: 'info',
  },
  failed: {
    label: 'Fejlet',
    color: 'error',
  },
}

export default function SalesDistributionWidget({ merchantId, storeId, startPeriod, endPeriod, selectedPeriod }) {

  const { data, loading } = useQuery(GET_SALES_DISTRIBUTION_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  })

  return (
    <Card>
      <CardHeader title="Salg" />

      <Stack spacing={3} sx={{ px: 3, my: 5 }}>
        {data?.map((sale, i) => {
          return (
            <LinearProgress
              variant="determinate"
              key={i}
              value={sale.percentage}
              color={salesStatuses[sale.status].color}
              sx={{ height: 8, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16) }}
            />
          );
        })}
      </Stack>

      <Grid container sx={{ px: 3, pb: 3 }} spacing={3}>
        {data?.map((sale, i) => (
          <Grid xs={4} key={i} item display="flex" direction="column" justifyContent="center" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  backgroundColor: `${salesStatuses[sale.status].color}.main`,
                }}
              />

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {salesStatuses[sale.status].label}
              </Typography>
            </Stack>

            <Typography variant="h6">{sale.num ? fShortenNumber(sale.num) : 0}</Typography>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
