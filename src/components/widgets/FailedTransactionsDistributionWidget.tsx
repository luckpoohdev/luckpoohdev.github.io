// react
import { useMemo } from 'react';
// charts
import { ApexOptions } from 'apexcharts';
import apexLocaleDa from 'src/locales/apex/da.json';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardProps } from '@mui/material';
// utils
import { fNumber } from 'src/utils/formatNumber';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------


import { useQuery } from 'src/hooks/apollo';
import { GET_FAILED_TRANSACTIONS_DISTRIBUTION_WIDGET_DATA } from 'src/queries/widget';

const CHART_HEIGHT = 400;

const LEGEND_HEIGHT = 72;

const StyledChart = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT,
  },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important' as 'relative',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function FailedTransactionsDistributionWidget({
  merchantId,
  storeId,
  startPeriod,
  endPeriod,
  selectedPeriod,
}) {
  
  const theme = useTheme();

  const { data, loading } = useQuery(GET_FAILED_TRANSACTIONS_DISTRIBUTION_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  });

  const total = useMemo(() => parseInt(data?.num_failed_settlements ?? 0, 10) + parseInt(data?.num_failed_authorizations ?? 0, 10), [ data, loading ])

  const chartColors = [
    theme.palette.error.main, theme.palette.warning.main
  ];

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    labels: ['Hævninger', 'Autoriseringer'],
    legend: {
      floating: true,
      horizontalAlign: 'center',
    },
    colors: chartColors,
    plotOptions: {
      pie: {
        donut: {
          size: '87%',
          labels: {
            total: {
              label: total === 1 ? 'Fejlende transaktion' : 'Fejlende transaktioner',
            },
          },
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader title="Fejlende transaktioner" />

      <StyledChart dir="ltr">
        <Chart type="donut" series={[
          data?.num_failed_settlements ?? 0,
          data?.num_failed_authorizations ?? 0,
        ]} options={chartOptions} height={250} />
      </StyledChart>
    </Card>
  );
}
