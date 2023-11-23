import { useState, useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import apexLocaleDa from 'src/locales/apex/da.json';
// dayjs
import dayjs from 'dayjs';
// @mui
import { Card, CardHeader, Box, CardProps, Typography, Stack, Avatar, Grid, Icon, Image } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
// components
import { CustomSmallSelect } from 'src/components/custom-input';
import Chart, { useChart } from 'src/components/chart';

import { useQuery } from 'src/hooks/apollo';
import { GET_ACQUIRING_COSTS_OVERVIEW_WIDGET_DATA } from 'src/queries/widget';

import { fPercent } from 'src/utils/formatNumber';
import { fDateTime } from 'src/utils/formatTime';

import Iconify from 'src/components/iconify/Iconify';

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

function CardCost({
  title,
  percent,
  total,
  amount,
  chart,
  currency,
  src,
  sx,
  ...other
}) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h3" gutterBottom>
          {total ? fPercent(total, '.00') : '0%'}
        </Typography>
        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
          <Typography variant="subtitle2" component="div" noWrap>
            <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
              {title}
            </Box>
          </Typography>
        </Stack>
      </Box>
      <Avatar sx={(theme) => ({ width: 120, height: 120, backgroundColor: theme.palette.background.neutral })}>
          <img src="/assets/icons/cmses/woocommerce.svg" width={48} height={48} />
      </Avatar>
    </Card>
  );
}

export default function CmsFeesWidget({ merchantId, storeId, startPeriod, endPeriod, selectedPeriod }) {

  const theme = useTheme();

  const periodDays = useMemo(() => startPeriod && endPeriod ? endPeriod.diff(startPeriod, 'day')+1 : null, [ startPeriod, endPeriod ]);

  if (!merchantId && !storeId && (!startPeriod || !endPeriod)) return null;

  const { data, loading } = /*useQuery(GET_ACQUIRING_COSTS_OVERVIEW_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  })*/{ data: null, loading: false };

  if (loading) return null;

  const chartOptions = useChart({
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
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      type: 'datetime',
      min: data?.chart?.series?.[0]?.[0]?.[0],
      max: data?.chart?.series?.[0]?.[data?.chart?.series?.[0]?.length-1]?.[0],
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => fPercent(value, '.00'),
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => fPercent(value, '.00'),
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
    <Grid item xs={12} md={12}>
      <CardCost title="CMS strafgebyr" total={data?.total_percentage ?? 0} sx={{ '& .MuiAvatar-img': { objectFit: 'contain' } }} />
    </Grid>
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
