import { ApexOptions } from 'apexcharts';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Card, Typography, Stack, CardProps } from '@mui/material';
// utils
import { fNumber, fPercent, fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';
import Chart, { useChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  currency: string;
  percent: number;
  inverseTrending: boolean;
  chart: {
    colors?: string[];
    series: number[];
    options?: ApexOptions;
  };
}

export default function EcommerceCostsOfPayment({
  title,
  percent,
  total,
  amount,
  chart,
  currency,
  sx,
  inverseTrending,
  ...other
}: Props) {
  const { colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    chart: {
      animations: {
        enabled: true,
      },
      sparkline: {
        enabled: true,
      },
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
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (value: number) => fPercent(value, '.000'),
        title: {
          formatter: () => '',
        },
      },
      marker: {
        show: false,
      },
    },
    ...options,
  });

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" paragraph>
          {title}
        </Typography>

        <Typography variant="h3" gutterBottom>
          {currency ? fCurrency(total) : (amount ?? fPercent(total, '.000'))}
        </Typography>

        <TrendingInfo percent={percent} inverse={inverseTrending} />
      </Box>

      <Chart
        type={amount ? 'bar' : 'line'}
        series={[{ data: series }]}
        options={chartOptions}
        width={amount ? 200 : 120}
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
        icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
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

        {fPercent(percent, '.000')}

        <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
          {percent ? ' fra forrige' : <>&nbsp;</>}
        </Box>
      </Typography>
    </Stack>
  );
}
