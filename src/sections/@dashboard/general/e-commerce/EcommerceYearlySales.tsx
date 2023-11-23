import { ApexOptions } from 'apexcharts';
import { useState } from 'react';
// @mui
import { Card, CardHeader, Box, CardProps } from '@mui/material';
// components
import { CustomSmallSelect } from '../../../../components/custom-input';
import Chart, { useChart } from '../../../../components/chart';

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

export default function EcommerceYearlySales({ title, noArea, subheader, chart, ...other }: Props) {
  const { colors, categories, series, options } = chart;

  const chartOptions = useChart({
    colors,
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories,
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
      />
      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <Chart type={noArea ? 'line' : 'area'} series={series} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
