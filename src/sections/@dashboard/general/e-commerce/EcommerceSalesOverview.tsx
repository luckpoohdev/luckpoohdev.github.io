// react
import * as React from 'react'
import { useMemo } from 'react'
// @mui
import { Card, CardHeader, Typography, Stack, LinearProgress, CardProps } from '@mui/material';
// framer
import { m } from 'framer-motion';
// utils
import { fPercent, fCurrency } from '../../../../utils/formatNumber';
// components
import ElementLimiter from 'src/components/element-limiter';
// ----------------------------------------------------------------------

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

const MotionStack = m(React.forwardRef(({ children, ...props }, ref) => <Stack ref={ref} {...props}>{children}</Stack>))
const Limiter = ({ children, maxVisible, ...props }) => <ElementLimiter Component={MotionStack} componentProps={props} maxVisible={maxVisible} buttonProps={{ sx: { m: 2.5, width: 'calc(100% - 2.5rem)' } }}>{children}</ElementLimiter>

export default function EcommerceSalesOverview({ title, subheader, data, maxVisible, ...other }: Props) {
  const items = useMemo(() => data.map((progress) => (
    <ProgressItem key={progress.label} progress={progress} />
  )), [ JSON.stringify(data) ])
  const ItemWrapper = typeof maxVisible == 'undefined' ? Stack : Limiter
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <ItemWrapper spacing={4} sx={{ p: 3, pb: typeof maxVisible === 'undefined' ? 3 : 0 }} maxVisible={maxVisible}>
        {items}
      </ItemWrapper>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ProgressItemProps = {
  progress: ItemProps;
};

function ProgressItem({ progress }: ProgressItemProps) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {progress.label}
        </Typography>
        <Typography variant="subtitle2">{fCurrency(progress.amount)}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({fPercent(progress.value)})
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress.value}
        color={progress.color ?? (
          (progress.label === 'Total Income' && 'info') ||
          (progress.label === 'Total Expenses' && 'warning') ||
          'primary'
        )}
      />
    </Stack>
  );
}
