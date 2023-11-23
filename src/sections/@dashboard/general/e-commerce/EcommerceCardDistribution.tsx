import { ApexOptions } from 'apexcharts';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardProps } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
// components
import Chart, { useChart } from '../../../../components/chart';

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

export default function EcommerceCardDistribution({ title, subheader, total, chart, ...other }: Props) {
  const theme = useTheme();

  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartColors = colors || [
    theme.palette.primary.main,
    theme.palette.warning.main,
  ];

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    labels: series.map((i) => i.label),
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
        return val + "%"
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
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <StyledChart dir="ltr">
        <Chart type="pie" series={chartSeries} options={chartOptions} height={300} />
      </StyledChart>
    </Card>
  );
}
