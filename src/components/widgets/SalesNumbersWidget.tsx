import { useState, useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import apexLocaleDa from 'src/locales/apex/da.json';
// dayjs
import dayjs from 'dayjs';
// @mui
import { Card, CardHeader, Box, CardProps } from '@mui/material';
import { useTheme } from '@mui/system';
// components
import { CustomSmallSelect } from 'src/components/custom-input';
import Chart, { useChart } from 'src/components/chart';

import { useQuery } from 'src/hooks/apollo';
import { GET_SALES_NUMBERS_WIDGET_DATA } from 'src/queries/widget';

import { fNumber } from 'src/utils/formatNumber';
import { fDateTime } from 'src/utils/formatTime';

// ----------------------------------------------------------------------

export default function SalesNumbersWidget({ merchantId, storeId, startPeriod, endPeriod, selectedPeriod }) {

  const theme = useTheme();

  const periodDays = useMemo(() => startPeriod && endPeriod ? endPeriod.diff(startPeriod, 'day')+1 : null, [ startPeriod, endPeriod ]);

  const { data, loading } = useQuery(GET_SALES_NUMBERS_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  })

  const chartOptions = useChart({
    colors: [
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.warning.main,
    ],
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
      tickAmount: Math.max(data?.chart?.series?.[0]?.length, data?.chart?.series?.[1]?.length, data?.chart?.series?.[2]?.length),
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => fNumber(value),
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      x: {
        formatter: (value, options) => {
          return dayjs(parseFloat(value)).format(`DD-MM-YYYY${periodDays < 7 ? ' HH:mm' : ''}`);
        },
      },
      marker: {
        show: false,
      },
    },
  });

  return loading ? null :(
    <Card>
      <CardHeader
        title="Salg"
        subheader={`(${String(data?.delta_percentage ?? 0).replace('.', ',')}%) fra forrige`}
      />
      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <Chart type="line" series={data?.chart?.series ? [{
          name: 'Gennemførte',
          data: data.chart.series[0],
        }, {
          name: 'Fejlede',
          data: data.chart.series[1],
        }, {
          name: 'Returnerede',
          data: data.chart.series[2],
        }] : []} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
