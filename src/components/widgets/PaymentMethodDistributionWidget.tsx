// react
import * as React from 'react'
import { useMemo } from 'react'
// @mui
import { Card, CardHeader, Typography, Stack, LinearProgress, CardProps } from '@mui/material';
// framer
import { m } from 'framer-motion';
// utils
import { fPercent, fCurrency } from 'src/utils/formatNumber';
// components
import ElementLimiter from 'src/components/element-limiter';
// ----------------------------------------------------------------------

import { GET_PAYMENT_METHOD_DISTRIBUTION_WIDGET_DATA } from 'src/queries/widget';
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

const MotionStack = m(React.forwardRef(({ children, ...props }, ref) => <Stack ref={ref} {...props}>{children}</Stack>))
const Limiter = ({ children, maxVisible, ...props }) => <ElementLimiter Component={MotionStack} componentProps={props} maxVisible={maxVisible} buttonProps={{ sx: { m: 2.5, width: 'calc(100% - 2.5rem)' } }}>{children}</ElementLimiter>

export default function PaymentMethodDistributionWidget({ merchantId, storeId, startPeriod, endPeriod, selectedPeriod, maxVisible }: Props) {

  const periodDays = useMemo(() => startPeriod && endPeriod ? endPeriod.diff(startPeriod, 'day')+1 : null, [ startPeriod, endPeriod ]);

  const { data, loading } = useQuery(GET_PAYMENT_METHOD_DISTRIBUTION_WIDGET_DATA, {
    variables: {
      merchantId,
      storeId,
      startPeriod,
      endPeriod,
      selectedPeriod,
    }
  })

  const items = useMemo(() => data?.payment_methods?.map((payment_method, i) => (
    <PaymentMethod key={i} percentage={payment_method.percentage} sum_amount={Math.round(payment_method.sum_amount)} label={payment_method.payment_method} />
  )), [ JSON.stringify(data) ])

  if (!merchantId && !storeId && (!startPeriod || !endPeriod)) return null;

  if (loading || !data) return null;

  const ItemWrapper = typeof maxVisible == 'undefined' ? Stack : Limiter
  return (
    <Card>
      <CardHeader title="Betalingsformer" />
      <ItemWrapper spacing={4} sx={{ p: 3, pb: typeof maxVisible === 'undefined' ? 3 : 0 }} maxVisible={maxVisible}>
        {items}
      </ItemWrapper>
    </Card>
  );
}

// ----------------------------------------------------------------------
const paymentMethods = {
  'card': 'Kortbetaling',
  'mobilepay': 'MobilePay',
  'googlepay': 'Google Pay',
  'viabill': 'ViaBill',
  'applepay': 'Apple Pay',
}
function PaymentMethod({ percentage, sum_amount, label }) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {paymentMethods[label] ?? label}
        </Typography>
        <Typography variant="subtitle2">{fCurrency(sum_amount)}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({fPercent(percentage) ? fPercent(percentage) : '0%'})
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={percentage}
        color="primary"
      />
    </Stack>
  );
}
