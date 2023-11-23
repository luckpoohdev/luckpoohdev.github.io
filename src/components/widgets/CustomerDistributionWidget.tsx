// react
import { useMemo } from 'react';
// charts
import { ApexOptions } from 'apexcharts';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardProps } from '@mui/material';
// utils
import { fNumber } from 'src/utils/formatNumber';
// components
import Chart, { useChart } from 'src/components/chart';

import { useQuery } from 'src/hooks/apollo';

import { GET_CUSTOMER_DISTRIBUTION_WIDGET_DATA } from 'src/queries/widget';

// ----------------------------------------------------------------------

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

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  total: number;
  chart: {
    colors?: string[][];
    series: {
      label: string;
      value: number;
    }[];
    options?: ApexOptions;
  };
}

export default function CustomerDistributionWidget({ merchantId, storeId, startPeriod, endPeriod, selectedPeriod }) {

  const theme = useTheme();

  const periodDays = useMemo(() => startPeriod && endPeriod ? endPeriod.diff(startPeriod, 'day')+1 : null, [ startPeriod, endPeriod ]);

  if (!merchantId && !storeId && (!startPeriod || !endPeriod)) return null;

  const { data, loading } = useQuery(GET_CUSTOMER_DISTRIBUTION_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  })

  if (loading || !data) return null;
  
  const chartColors = [
    theme.palette.primary.main,
    theme.palette.info.main,
  ];

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    labels: [
      'Nye',
      'Tilbagevendende',
    ],
    legend: {
      floating: true,
      horizontalAlign: 'center',
      markers: {
        fillColors: chartColors,
      },
    },
    fill: {
      type: 'solid',
      colors: chartColors,
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + '%'
      },
      dropShadow: {
        enabled: false,
      },
      style: {
        fontSize: 'default',
        fontWeight: 'light',
      }
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -35,
          minAngleToShowLabel: 1,
        },
        donut: {
          labels: {
            show: false,
            name: {
              show: false,
            },
            value: {
              show: false,
            },
            total: {
              show: false,
              showAlways: false,
            },
          },
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader title="Kunder" />

      <StyledChart dir="ltr">
        <Chart type="pie" series={[data?.new_customers_percentage, data?.repeat_customers_percentage]} options={chartOptions} height={300} />
      </StyledChart>
    </Card>
  );
}
