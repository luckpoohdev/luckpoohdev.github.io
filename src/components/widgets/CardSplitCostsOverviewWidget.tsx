import { ApexOptions } from 'apexcharts';
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
import { GET_CARD_SPLIT_COSTS_OVERVIEW_WIDGET_DATA } from 'src/queries/widget';
import { useMemo } from 'react';

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

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: {
      label: string;
      value: number;
    }[];
    options?: ApexOptions;
  };
}

const translateSubBrand = (subBrand) => subBrand.replace('_', ' ');

export default function CardSplitCostsOverviewWidget({ merchantId, storeId, startPeriod, endPeriod, selectedPeriod, ...rest })  {
  
  const theme = useTheme();

  const isDesktop = useResponsive('up', 'sm');

  const { data, loading } = useQuery(GET_CARD_SPLIT_COSTS_OVERVIEW_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  });
/*
[
      { label: 'Dankort', value: 61111.111 },
      { label: 'VISA/Dankort', value: 61111.111 },
      { label: 'VISA debet', value: 61111.111 },
      { label: 'VISA kredit', value: 61111.111 },
      { label: 'VISA corp', value: 61111.111 },
      { label: 'MasterCard debet', value: 61111.111 },
      { label: 'MasterCard kredit', value: 61111.111 },
      { label: 'MasterCard corp', value: 61111.111 },
      { label: 'AMEX', value: 61111.111 },
    ]
*/


  const chartOptions = useChart({
    labels: data?.cards?.map((i) => i.label) ?? [],
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
    <StyledRoot {...rest}>
      <CardHeader title="Kortsplit" />

      <Box sx={{ my: 5 }} dir="ltr">
        <Chart
          type="polarArea"
          series={data?.cards?.map((i) => i.value) ?? []}
          options={chartOptions}
          height={isDesktop ? 240 : 360}
        />
      </Box>

      <Divider />

      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Box sx={{ py: 2, width: 1, textAlign: 'center' }}>
          <Typography sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>Korttyper</Typography>

          <Typography sx={{ typography: 'h4' }}>{data?.cards?.length ?? 0}</Typography>
        </Box>

        <Box sx={{ py: 2, width: 1, textAlign: 'center' }}>
          <Typography sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>Totale omkostninger</Typography>

          <Typography sx={{ typography: 'h4' }}>{fCurrency(data?.total ?? 0)}</Typography>
        </Box>
      </Stack>
    </StyledRoot>
  );
}
