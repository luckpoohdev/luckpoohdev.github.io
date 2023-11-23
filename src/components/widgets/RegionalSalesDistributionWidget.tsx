// react
import { useMemo } from 'react';
// apex
import { ApexOptions } from 'apexcharts';
// countries
import countries from 'i18n-iso-countries';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Card, Stack, Divider, CardHeader, Typography, CardProps } from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// components
import Chart, { useChart } from 'src/components/chart';
// utils
import { fCurrency } from 'src/utils/formatNumber';

import { useQuery } from 'src/hooks/apollo';

import { GET_REGIONAL_SALES_DISTRIBUTION_WIDGET_DATA } from 'src/queries/widget';

import countryLocaleDA from 'i18n-iso-countries/langs/da.json'
countries.registerLocale(countryLocaleDA);


// ----------------------------------------------------------------------

const StyledRoot = styled(Card)(({ theme }) => ({
  '& .apexcharts-legend': {
    width: 240,
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'wrap',
      height: 160,
      width: '50%',
    },
  },
  '& .apexcharts-datalabels-group': {
    display: 'none',
  },
}));

// ----------------------------------------------------------------------

export default function RegionalSalesDistributionWidget({ merchantId, storeId, startPeriod, endPeriod, selectedPeriod }) {

  const theme = useTheme();

  const isDesktop = useResponsive('up', 'sm');

  const { data, loading } = useQuery(GET_REGIONAL_SALES_DISTRIBUTION_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  })

  const labels = useMemo(() => data?.countries?.map((country) => country.region ? (countries.getName(country.region, 'da') ?? country.region) : 'Ukendt') ?? [], [ data, loading ]);
  const series = useMemo(() => data?.countries?.map((country) => country.sum_total) ?? [], [ data, loading ]);

  const chartOptions = useChart({
    labels,
    tooltip: {
      y: {
        formatter: (val) => fCurrency(val),
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => fCurrency(val)
      },
    },
    stroke: {
      colors: [theme.palette.background.paper],
    },
    fill: { opacity: 0.8 },
    legend: {
      position: 'right',
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          legend: {
            position: 'bottom',
            horizontalAlign: 'left',
          },
        },
      },
    ],
  });

  return (
    <StyledRoot>
      <CardHeader title="Kundesegmenter"  />

      <Box sx={{ my: 5 }} dir="ltr">
        <Chart
          type="polarArea"
          series={series}
          options={chartOptions}
          height={isDesktop ? 240 : 360}
        />
      </Box>

      <Divider />

      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Box sx={{ py: 2, width: 1, textAlign: 'center' }}>
          <Typography sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>Lande</Typography>
          <Typography sx={{ typography: 'h4' }}>{data?.countries?.length}</Typography>
        </Box>

        <Box sx={{ py: 2, width: 1, textAlign: 'center' }}>
          <Typography sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>Totale omsætning</Typography>
          <Typography sx={{ typography: 'h4' }}>{fCurrency(data?.total)}</Typography>
        </Box>
      </Stack>
    </StyledRoot>
  );
}
