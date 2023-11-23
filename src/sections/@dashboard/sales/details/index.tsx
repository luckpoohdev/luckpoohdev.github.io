// react
import { useMemo } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
  CircularProgress,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// apollo
import { useMutation } from '@apollo/client';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// _mock_
import { IInvoice } from '../../../../@types/invoice';
// components
import Label from '../../../../components/label';
import Image from '../../../../components/image';
import Scrollbar from '../../../../components/scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';

import useConfirmDialog from 'src/hooks/useConfirmDialog';
import { useQuery } from 'src/hooks/apollo';

import { GET_SALE, CAPTURE_PAYMENT, CANCEL_PAYMENT, REFUND_PAYMENT } from 'src/queries/sale'

import { SALE_STATUSES, SALE_STATUS_COLORS } from 'src/config-global';
import CenteredLoadingIndicator from '@/components/centered-loading-indicator';

// ----------------------------------------------------------------------

const StyledRowResult = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  invoice?: IInvoice;
};

export default function OrderDetails({ saleId, storeId }: Props) {

  const saleQuery = useQuery(GET_SALE, {
    variables: {
      id: saleId,
      store_id: storeId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const [ capturePayment, capturePaymentQuery ] = useMutation(CAPTURE_PAYMENT);
  const [ cancelPayment, cancelPaymentQuery ] = useMutation(CANCEL_PAYMENT);
  const [ refundPayment, refundPaymentQuery ] = useMutation(REFUND_PAYMENT);

  const [ completeSale, ConfirmCaptureDialog ] = useConfirmDialog({
    onConfirm: async () => {
      await capturePayment({
        variables: {
          saleId,
        },
      });
      saleQuery.refetch();
    },
  });

  const [ cancelSale, ConfirmCancelDialog ] = useConfirmDialog({
    onConfirm: async () => {
      await cancelPayment({
        variables: {
          saleId,
        },
      });
      saleQuery.refetch();
    },
  });

  const [ refundSale, ConfirmRefundDialog ] = useConfirmDialog({
    onConfirm: async () => {
      await refundPayment({
        variables: {
          saleId,
        },
      });
      saleQuery.refetch();
    },
  });

  const sale = saleQuery.data ?? {};

  return saleQuery.loading ? <CenteredLoadingIndicator /> : (
    <>

      <ConfirmCaptureDialog title="Gennemfør betaling">
        <Typography gutterBottom>Du er ved at trække penge fra en kunde.</Typography>
        <Typography>Er du sikker på at du vil fortsætte?</Typography>
      </ConfirmCaptureDialog>
      <ConfirmCancelDialog title="Annuller salg">
        <Typography gutterBottom>Du er ved at annullere et salg.</Typography>
        <Typography gutterBottom>Denne handling kan ikke fortrydes!</Typography>
        <Typography>Er du sikker på at du vil fortsætte?</Typography>
      </ConfirmCancelDialog>
      <ConfirmRefundDialog title="Refunder salg">
        <Typography gutterBottom>Du er ved at føre penge tilbage til en kunde.</Typography>
        <Typography gutterBottom>Denne handling kan ikke fortrydes!</Typography>
        <Typography>Er du sikker på at du vil fortsætte?</Typography>
      </ConfirmRefundDialog>
      
      <Card sx={{ p: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            {sale.payment_status === 'settled' || sale.payment_status === 'paid' ? (
              <LoadingButton size="large" sx={{ textTransform: 'none', py: 4 }} variant="contained" onClick={refundSale} loading={refundPaymentQuery.loading}>Refunder betaling</LoadingButton>
            ) : (sale.payment_status === 'authorized' ? (
              <>
                <LoadingButton size="large" sx={{ textTransform: 'none', py: 4, mr: 2 }} variant="contained" onClick={completeSale} loading={capturePaymentQuery.loading}>Hæv betaling</LoadingButton>
                <LoadingButton size="large" sx={{ textTransform: 'none', py: 4 }} variant="contained" onClick={cancelSale} loading={cancelPaymentQuery.loading}>Annuller betaling</LoadingButton>
              </>
            ) : null)}
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant="soft"
                color={SALE_STATUS_COLORS[sale.status] ?? 'default'}
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {SALE_STATUSES[sale.status] ?? sale.status}
              </Label>

              <Typography variant="h6">{sale.id}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Oprettet
            </Typography>

            <Typography variant="body2">{fDate(sale.placed_at)}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Forfalder
            </Typography>

            <Typography variant="body2">{fDate(sale.placed_at)}</Typography>
          </Grid>
        </Grid>

        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>

                  <TableCell align="left">Beskrivelse</TableCell>

                  <TableCell align="left">Antal</TableCell>

                  <TableCell align="right">Stykpris</TableCell>

                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {sale?.lines?.map((line, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Typography variant="subtitle2">{line.title}</Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          {line.description}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="left">{line.quantity}</TableCell>

                    <TableCell align="right">{fCurrency(line.total/line.quantity)}</TableCell>

                    <TableCell align="right">{fCurrency(line.total)}</TableCell>
                  </TableRow>
                ))}

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    <Box sx={{ mt: 2 }} />
                    Fragt
                  </TableCell>

                  <TableCell
                    align="right"
                    width={120}
                    sx={{ typography: 'body1' }}
                  >
                    <Box sx={{ mt: 2 }} />
                    {fCurrency(sale.shipping_amount)}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'h6' }}>
                    Total
                  </TableCell>

                  <TableCell align="right" width={140} sx={{ typography: 'h6' }}>
                    {fCurrency(sale.sum_total_amount)}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    Moms
                  </TableCell>

                  <TableCell align="right" width={120} sx={{ typography: 'body1' }}>
                    {sale.sum_total_amount_vat && fCurrency(sale.sum_total_amount_vat)}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    Uden moms
                  </TableCell>

                  <TableCell align="right" width={120} sx={{ typography: 'body1' }}>
                    {fCurrency((sale.sum_total_amount_no_vat))}
                  </TableCell>
                </StyledRowResult>

              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
    </>
  );
}
