import { ApexOptions } from 'apexcharts';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Card, Typography, Stack, CardProps } from '@mui/material';
// utils
import { fNumber, fPercent, fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';
import Chart from '../../../../components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  currency: string;
  percent: number;
  chart: {
    colors?: string[];
    series: number[];
    options?: ApexOptions;
  };
}

export default function AppWidgetSummary({ title, percent, chartType = "bar", inverseTrending, percentage, total, currency, chart, sx, ...other }: Props) {
  const { colors, series, options } = chart;

  const chartOptions = {
    colors,
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '68%',
        borderRadius: 2,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      marker: { show: false },
    },
    ...options,
  };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{title}</Typography>

        <TrendingInfo percent={percent} inverse={inverseTrending} />

        <Typography variant="h3">{currency ? fCurrency(total) : (percentage ? `${String(total).replace('.', ',')}%` : fNumber(total))}</Typography>
      </Box>

      <Chart type={chartType} series={[{ data: series }]} options={chartOptions} width={60} height={36} />
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
        icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
        sx={{
          mr: 1,
          p: 0.5,
          width: 24,
          height: 24,
          borderRadius: '50%',
          color: 'success.main',
          bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
          ...((inverse ? percent > 0 : percent < 0) && {
            color: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
          }),
        }}
      />

      <Typography component="div" variant="subtitle2">
        {percent > 0 && '+'}

        {fPercent(percent)}
      </Typography>
    </Stack>
  );
}
