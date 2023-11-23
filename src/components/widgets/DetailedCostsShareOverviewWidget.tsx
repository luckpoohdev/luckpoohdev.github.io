// react
import * as React from 'react'
import { useMemo, useState } from 'react'
// @mui
import { Card, CardHeader, Typography, Stack, LinearProgress, CardProps, Collapse, Button, Box } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// framer
import { m } from 'framer-motion';
// utils
import { fPercent, fCurrency } from 'src/utils/formatNumber';
// components
import ElementLimiter from 'src/components/element-limiter';
// ----------------------------------------------------------------------

import { GET_DETAILED_COSTS_SHARE_OVERVIEW_WIDGET_DATA } from 'src/queries/widget';
import { useQuery } from 'src/hooks/apollo';

type ItemProps = {
  label: string;
  amount: number;
  value: number;
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  data: ItemProps[];
}

const MotionArrowDownwardIcon = m(React.forwardRef((props, ref) => <ArrowDownwardIcon ref={ref} {...props} />))

const Limiter = ({ children, maxVisible, ...props }) => {
  const childArray = React.Children.toArray(children);
  const [ open, setOpen ] = useState(false);
  const visibleChildren = maxVisible ? childArray?.slice(0, maxVisible) ?? [] : childArray;
  const hiddenChildren = maxVisible && childArray?.length > maxVisible ? childArray?.slice(maxVisible) ?? [] : [];
  console.log('visibleChildren:', visibleChildren);
  return (
    <>
      <Stack spacing={4} sx={{ p: 3, pb: 0 }} direction="column">
        {visibleChildren}
        <Collapse in={open} sx={{ '& .MuiCollapse-wrapperInner': { '& > *:not(:first-child)': { mt: 4 }, mb: 4 } }}>
          {hiddenChildren}
        </Collapse>
      </Stack>
      {hiddenChildren.length ? (
        <Box sx={{ px: 3, mb: 3 }}>
          <Button fullWidth endIcon={<MotionArrowDownwardIcon animate={{ rotate: open ? 180 : 0 }} />} sx={(theme) => ({ justifyContent: 'space-between', color: theme.palette.grey[800] })} onClick={() => setOpen((open) => !open)}>
            {open ? 'Vis færre' : 'Vis alle'}
          </Button>
        </Box>
      ) : null}
    </>
  );
}

export default function DetailedCostsShareOverviewWidget({ merchantId, storeId, startPeriod, endPeriod, selectedPeriod, ...rest })  {

  const { data, loading } = useQuery(GET_DETAILED_COSTS_SHARE_OVERVIEW_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  });
  const items = useMemo(() => data?.map((service) => {
    return (
      <ProgressItem key={service.label} label={service.label} percentage={service.percentage} value={service.value} />
    );
  }) ?? [], [ data ])
  if (loading || !data) return null;
  return (
    <Card {...rest}>
      <CardHeader title="Services" />
      <Limiter maxVisible={3}>
        {items}
      </Limiter>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ProgressItemProps = {
  progress: ItemProps;
};

function ProgressItem({ label, percentage, value }) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {label}
        </Typography>
        <Typography variant="subtitle2">{fCurrency(value)}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({percentage ? fPercent(percentage) : '0%'})
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={percentage}
        color={'primary'}
      />
    </Stack>
  );
}
