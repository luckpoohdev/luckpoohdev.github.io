// react
import { useMemo } from 'react';
// charts
import { ApexOptions } from 'apexcharts';
import apexLocaleDa from 'src/locales/apex/da.json';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Typography, Stack, CardProps } from '@mui/material';
// dayjs
import dayjs from 'dayjs';
// utils
import { fNumber, fPercent } from 'src/utils/formatNumber';
// components
import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';


import { useQuery } from 'src/hooks/apollo';
import { GET_PARTIALLY_RETURNED_SALES_WIDGET_DATA } from 'src/queries/widget';

// ----------------------------------------------------------------------

export default function PartiallyReturnedSalesWidget({
  merchantId,
  storeId,
  startPeriod,
  endPeriod,
  selectedPeriod,
}) {

  const periodDays = useMemo(() => startPeriod && endPeriod ? endPeriod.diff(startPeriod, 'day')+1 : null, [ startPeriod, endPeriod ]);

  const theme = useTheme();

  const { data, loading } = useQuery(GET_PARTIALLY_RETURNED_SALES_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  })

  const chartOptions = useChart({
    colors: [theme.palette.primary.main],
    chart: {
      locales: [apexLocaleDa],
      defaultLocale: 'da',
      animations: {
        enabled: true,
      },
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      show: false,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    stroke: {
      width: 2,
    },
    plotOptions: {
      bar: {
        columnWidth: '80%',
        borderRadius: 2,
      },
    },
    xaxis: {
      show: false,
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      x: {
        show: true,
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
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" paragraph>Delvist returnerede salg</Typography>
        <Typography variant="h3" gutterBottom>{data?.total ? fNumber(data?.total) : 0}</Typography>
        <TrendingInfo percent={data?.total_delta_percentage ?? 0} inverse />
      </Box>

      <Chart
        type="bar"
        series={[{ data: data?.chart?.series?.[0] ?? [] }]}
        options={chartOptions}
        width={200}
        height={80}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type TrendingInfoProps = {
  percent: number;
};

function TrendingInfo({ percent, inverse }: TrendingInfoProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
      <Iconify
        icon={percent === 0 ? 'material-symbols:trending-flat-rounded' : (percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill')}
        sx={{
          mr: 1,
          p: 0.5,
          width: 24,
          height: 24,
          borderRadius: '50%',
          color: (theme) => alpha(theme.palette.success.main, percent === null ? 0 : 1),
          bgcolor: (theme) => alpha(theme.palette.success.main, percent === null ? 0.0 : 0.16),
          ...((inverse ? percent > 0 : percent < 0) && {
            color: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
          }),
        }}
      />

      <Typography variant="subtitle2" component="div" noWrap>
        {percent > 0 && '+'}
        {percent ? fPercent(percent, '.00') : `${0}%`}
        <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}> fra forrige</Box>
      </Typography>
    </Stack>
  );
}