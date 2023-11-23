import { useState, useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import apexLocaleDa from 'src/locales/apex/da.json';
// dayjs
import dayjs from 'dayjs';
// @mui
import { Card, CardHeader, Box, CardProps, Stack, Typography } from '@mui/material';
// components
import { CustomSmallSelect } from 'src/components/custom-input';
import Chart, { useChart } from 'src/components/chart';

import { useQuery } from 'src/hooks/apollo';
import { GET_REVENUE_WIDGET_DATA } from 'src/queries/widget';

import { fCurrency } from 'src/utils/formatNumber';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[];
    series: {
      year: string;
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ApexOptions;
  };
}

export default function DetailedRevenueWidget({ merchantId, storeId, startPeriod, endPeriod, selectedPeriod }) {

  const periodDays = useMemo(() => startPeriod && endPeriod ? endPeriod.diff(startPeriod, 'day')+1 : null, [ startPeriod, endPeriod ]);

  if (!merchantId && !storeId && (!startPeriod || !endPeriod)) return null;

  const { data, loading } = useQuery(GET_REVENUE_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  })

  if (loading || !data) return null;

  const chartOptions = useChart({
    chart: {
      locales: [apexLocaleDa],
      defaultLocale: 'da',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      min: startPeriod.valueOf(),
      max: endPeriod.hour(23).minute(59).second(59).valueOf(),
      tickAmount: data?.chart?.series?.[0]?.length,
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => fCurrency(value),
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => fCurrency(value),
        title: {
          formatter: () => '',
        },
      },
      x: {
        formatter: (value, options) => {
          return dayjs(parseFloat(value) - (options.seriesIndex === 1 ? periodDays*24*60*60*1000 : 0)).format(`DD-MM-YYYY${periodDays < 7 ? ' HH:mm' : ''}`);
        },
      },
      marker: {
        show: false,
      },
    },
  });
  return (
    <Card>
      <CardHeader
        title={
          <Stack justifyContent="space-between" direction="row">
            <Box>
              <Typography variant="h6">Omsætning</Typography>
              <Typography variant="body2" color="grey">{String(data.total_delta_percentage).replace('.', ',')}% fra forrige</Typography>
            </Box>
            <Box>
              <Typography variant="h5" color="primary" textAlign="right">{fCurrency(Math.round(data.total))}</Typography>
              <Typography variant="h5" color="warning.light" textAlign="right">{fCurrency(Math.round(data.previous_period_total))}</Typography>
            </Box>
          </Stack>
        }
      />
      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <Chart type="line" series={[{
          name: 'Nuværende periodes omsætning',
          data: data.chart.series[0],
        }, {
          name: 'Forrige periodes omsætning',
          data: data.chart.series[1],
        }]} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
