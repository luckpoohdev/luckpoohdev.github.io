// react
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
// Yup
import * as Yup from 'yup';
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Stack,
  Paper,
  Box,
  Tooltip,
  CardMedia,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataGridPro } from '@mui/x-data-grid-pro';
// react indiana scroll
import ScrollContainer from 'react-indiana-drag-scroll'
// framer
import { useIsomorphicLayoutEffect } from 'framer-motion';
// auth
import { useAuthContext } from 'src/auth/useAuthContext';
// layouts
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
// _mock_
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from 'src/_mock/arrays';
// components
import { useSettingsContext } from 'src/components/settings';
// sections
import {
    AppWidget,
    AppWelcome,
    AppFeatured,
    AppNewInvoice,
    AppTopAuthors,
    AppTopRelated,
    AppAreaInstalled,
    AppWidgetSummary,
    AppCurrentDownload,
    AppTopInstalledCountries,
} from 'src/sections/@dashboard/general/app';
// assets
import { SeoIllustration } from 'src/assets/illustrations';

import { useSelector } from 'src/redux/store';
import usePopover from 'src/hooks/usePopover';
import CustomButton from 'src/components/custom-button';
import MenuItem from '@mui/material/MenuItem';
import MoreActionsButton from 'src/components/more-actions-button';
import Iconify from 'src/components/iconify/Iconify';

import { fCurrency, fPercent } from 'src/utils/formatNumber';
import { PATH_APP } from 'src/routes/paths';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFSwitch, RHFTextField, RHFSelect } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useRouter from 'src/hooks/useRouter';
import { countries } from 'src/assets/data';
import LatestSalesTable from 'src/components/sales/latest';
// queries
import { GET_SOLUTION_NAME, GET_SOLUTION_GENERAL_DATA, GET_AVAILABLE_INTEGRATIONS } from 'src/queries/solution';
import { GET_INTEGRATIONS } from 'src/queries/integrations';
import { GET_ACQUIRING_SERVICE, GET_GATEWAY_SERVICE, GET_TERMINAL_SERVICE } from 'src/queries/service';
// hooks
import { useQuery } from 'src/hooks/apollo';
// ----------------------------------------------------------------------

import { AvatarGroup, Avatar } from '@mui/material';
import img from 'src/utils/img';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import useConfirmDialog from 'src/hooks/useConfirmDialog';
import AllSettlements from 'src/components/settlements/all';
import Dialog from 'src/components/custom-dialog';
import { AcquiringServiceCard, GatewayServiceCard } from 'src/components/service-card';
import { _userCards } from 'src/_mock/arrays';
import OrderDetails from 'src/sections/@dashboard/sales/details'
import Label from 'src/components/label/Label';
import { fDateTime, fDate, fDatePeriod } from 'src/utils/formatTime';
import CollapsibleCard from 'src/components/collapsible-card';
import LatestTransactionsTable from 'src/components/transactions/latest';

import { GET_SETTLEMENT } from 'src/queries/settlement'

import Icon from 'src/components/Icon';

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

function RenderStatusLabel(status: boolean) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <Label
      variant={isLight ? 'soft' : 'filled'}
      color={(!status && 'error') || 'success'}
      sx={{ mx: 'auto' }}
    >
      {status ? 'ja' : 'nej'}
    </Label>
  );
}

function RenderStatus(balanced: boolean) {
  return (
    (balanced && (
      <Icon name="ic_check" color="success.main" width="24px" height="24px" />
    )) || (!balanced && (
      <Icon name="ic_clock" color="warning.main" width="24px" height="24px" />
    ))
  )
}

import _mock from 'src/_mock';
import { randomInArray } from 'src/_mock';

import Scrollbar from 'src/components/scrollbar/Scrollbar';

import SimpleBar from 'simplebar-react'
import dayjs from 'dayjs';

import SettlementTransactions from 'src/components/settlements/transactions';

const settlementTypes = {
  'authorization':  'autorisering',
  'capture': 'hævning',
  'payout': 'udbetaling',
  'sale': 'salg', 
}

const SettlementItem = ({ settlement, onClick, selected }) => {

  const successSettlement = settlement.status_code !== 6

  const theme = useTheme()

  return (
    <Box sx={{ pt: 3, position: 'relative' }}>
      {selected && (
        <Iconify
          icon="uis:triangle"
          sx={{
            position: 'absolute',
            top: '7px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          color="primary.main"
        />
      )}
      <Card sx={{
          borderColor: selected ? theme.palette.primary.main : 'transparent',
          borderStyle: 'solid',
          borderWidth: '1px',
        '&:hover': {
          borderColor: theme.palette.primary.main,
        }
      }}>
        <CardActionArea onClick={() => typeof onClick === 'function' ? onClick(settlement.id) : null}>
          <CardHeader title={settlementTypes[settlement.type]} sx={{ textTransform: 'capitalize' }} />
          <CardContent sx={{ pt: 1.5 }}>
            <Stack direction="row" spacing={10} alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ position: 'relative', width: '20px', height: '20px' }}>
                  {settlement.balanced ? (
                    <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" />
                  ) : (
                    <Iconify icon="uis:exclamation-circle" color="error.main" />
                  )}
                  <Box
                    sx={{
                      backgroundColor: alpha(successSettlement ? theme.palette.success.main : theme.palette.error.main, 0.16),
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </Box>
                <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>{fCurrency(settlement.amount/100)}</Typography>
              </Stack>
              <Avatar sx={{ backgroundColor: 'background.paper', '& .MuiAvatar-img': { objectFit: 'contain', width: '80%', height: '80%' } }} src={img(settlement.source.logo.url)} />
            </Stack>
            <Typography variant="subtitle2" color="text.disabled">{fDateTime(settlement.created_at)}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  )
}

const sourceTypes = {
  acquiring: 'indløsning',
  gateway: 'gateway',
  cms: 'CMS',
}

import { TextField } from '@mui/material';
import ucfirst from 'src/utils/ucfirst';
import { Transaction } from 'firebase/firestore';
import CenteredLoadingIndicator from '@/components/centered-loading-indicator';

const Fieldset = ({ children, legend }) => {
  return (
    <TextField id="outlined-basic" label={legend} variant="outlined" value={ucfirst(children)} readonly focused disabled inputProps={{
      sx: (theme) => ({
        color: `${theme.palette.text.primary} !important`,
        '-webkit-text-fill-color': `${theme.palette.text.primary} !important`,
      }),
    }} />
  )
}

const humanizeCardType = (type) => {
  return type.split('_').join(' ')
}

const sanitizeCardType = (type) => {
  return (
    type.indexOf('mastercard') !== -1 && 'mastercard'
  ) || type
}

const RenderFeeType = (fee_type) => {
  switch (fee_type) {
    case 'refund': return 'Refundering';
    case 'settlement': return 'Hævning';
  }
}

const statusCodes = {
  20000: 'godkendt',
  6: 'afvist',
  '001719': 'godkendt',
}
const humanizeStatusCode = (statusCode) => statusCodes[statusCode] ?? statusCode

const Settlement = React.memo(() => {

  const router = useRouter()
  const solutionId = parseInt(router.query?.id.split(',')?.[0], 10);
  const settlementId = parseInt(router.query?.id.split(',')?.[1], 10);

  const settlementQuery = useQuery(GET_SETTLEMENT, {
    variables: {
      id: settlementId,
      solution_id: solutionId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });
  const settlement = settlementQuery.data ?? {}

  const selectSettlement = (id) => {
    router.push(PATH_APP.payments.settlements.view(id), undefined, { scroll: false })
  }

  return settlementQuery.loading ? <CenteredLoadingIndicator /> : (
    <>
      <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
        
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={5}>
            <Typography variant="h4">
              Afregninger: {settlementId}
            </Typography>
            <Label
              variant="soft"
              color="primary"
              sx={{ textTransform: 'capitalize' }}
            >Indløsning ({settlement.mid})</Label>
          </Stack>
          <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
            Se afregningsdetaljer og tilhørende transaktioner forneden
          </Typography>
        </Grid>
      </Grid>

      <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
        <Grid item xs={12} lg={4} xl={3}>
          <Card sx={{ backgroundColor: 'primary.main', px: 1, py: 2 }}>
            <CardContent component={Stack} direction="row" spacing={3} sx={{ position: 'relative' }}>
              <Avatar sx={{ width: 64, height: 64, backgroundColor: 'background.paper', '& .MuiAvatar-img': { objectFit: 'contain', width: '70%', height: '70%' } }} src={img(settlement.acquirer_icon_url)} />
              <Box>
                <Typography variant="h4" color="common.white">{fCurrency(settlement.payout_amount)}</Typography>
                <Typography variant="subtitle2" color="common.white" sx={{ fontWeight: 'light', textTransform: 'capitalize' }}>
                  Afregning
                </Typography>
              </Box>
              {!settlement.balanced && (
                <Icon name="ic_clock" color="common.white" sx={{ opacity: 0.25, position: 'absolute', width: '130%', height: '130%', right: '-60%', top: '-13%' }} />
              )}
              {settlement.balanced && (
                <Icon name="ic_check" color="common.white" sx={{ opacity: 0.25, position: 'absolute', width: '130%', height: '130%', right: '-60%', top: '-13%' }} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={8} xl={9}>
          <Card sx={{ p: 0, height: '100%' }}>
            <CardContent component={Stack} direction="row" sx={{ height: '100%', p: 0, '&:last-child': { p: 0 } }}>
              <Stack sx={{ flexGrow: 1, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ backgroundColor: 'background.neutral', p: 2 }}>Afregningsperiode</Typography>
                <Stack sx={{ height: '100%' }} justifyContent="center">
                  <Typography variant="body2" sx={{ p: 2 }}>{fDatePeriod(settlement.period_start, settlement.period_end)}</Typography>
                </Stack>
              </Stack>
              <Stack sx={{ flexGrow: 1, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ backgroundColor: 'background.neutral', p: 2 }}>Udbetalingsdato</Typography>
                <Stack sx={{ height: '100%', p: 2 }} justifyContent="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon="material-symbols:info-outline-rounded" />
                    <Typography variant="body2">{fDate(settlement.payout_date)}</Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack sx={{ height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ backgroundColor: 'background.neutral', p: 2 }}>Afstemt</Typography>
                <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
                  {RenderStatus(settlement.balanced)}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
            <CollapsibleCard>
              <CardHeader title={
                <Typography variant="h4">Afregningsdetaljer</Typography>
              } />
              <CardContent>
              <Box
                      rowGap={3.5} columnGap={{ xs: 3.5, md: 5 }}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        md: 'repeat(4, 1fr)',
                      }}
                      sx={{
                        pt: 1,
                      }}
                    >
                      <Fieldset legend="Afregningsvaluta">{settlement.currency}</Fieldset>
                      <Fieldset legend="Afregningsform">{settlement.settlement_type === 'net' ? 'Netto' : 'Brutto'}</Fieldset>
                      <Fieldset legend="Navn på banktransaktion">{settlement.bank_statement_id}</Fieldset>
                      <Fieldset legend="Afregnings-ID">{settlement.id}</Fieldset>
                      <Fieldset legend="Salg">{fCurrency(settlement.total_amount_sales)}</Fieldset>
                      <Fieldset legend="Refunderinger">{fCurrency(settlement.total_amount_refunds)}</Fieldset>
                      <Fieldset legend="Indsigelser">{fCurrency(settlement.total_amount_disputes)}</Fieldset>
                      <Fieldset legend="Transaktioner">{settlement.total_quantity_sales_transactions+settlement.total_quantity_refund_transactions+settlement.total_quantity_dispute_transactions}</Fieldset>
                      <Fieldset legend="Gebyrer">{fCurrency(settlement.total_amount_fees)}</Fieldset>
                    </Box>
              </CardContent>
            </CollapsibleCard>
        </Grid>

        <Grid item xs={12}>
          <CollapsibleCard>
            <CardHeader title={
              <Typography variant="h4">Opsummering</Typography>
            } />
            <CardContent>
              <Stack spacing={3}>
                <Stack justifyContent="space-between" alignItems="center" direction="row">
                  <Typography variant="body2">Salg ({settlement.total_quantity_sales_transactions} {settlement.total_quantity_sales_transactions === 1 ? 'transaktion' : 'transaktioner'})</Typography>
                  <Typography variant="body2">{fCurrency(settlement.total_amount_sales)}</Typography>
                </Stack>
                <Stack justifyContent="space-between" alignItems="center" direction="row" color="grey.500">
                  <Typography variant="body2">Refunderinger ({settlement.total_quantity_refund_transactions} {settlement.total_quantity_refund_transactions === 1 ? 'transaktion' : 'transaktioner'})</Typography>
                  <Typography variant="body2">-{fCurrency(settlement.total_amount_refunds)}</Typography>
                </Stack>
                <Stack justifyContent="space-between" alignItems="center" direction="row" color="grey.500">
                  <Typography variant="body2">Indsigelser ({settlement.total_quantity_dispute_transactions} {settlement.total_quantity_dispute_transactions === 1 ? 'transaktion' : 'transaktioner'})</Typography>
                  <Typography variant="body2">{fCurrency(settlement.total_amount_disputes)}</Typography>
                </Stack>
                <Stack justifyContent="space-between" alignItems="center" direction="row">
                  <Typography variant="body2">Transaktionsgebyrer</Typography>
                  <Typography variant="body2">-{fCurrency(settlement.total_amount_fees)}</Typography>
                </Stack>
                {settlement.fees?.map((fee) => (
                  <Stack justifyContent="space-between" alignItems="center" color="grey.500" direction="row">
                    <Typography variant="body2">- {RenderFeeType(fee.fee_type)}</Typography>
                    <Typography variant="body2">-{fCurrency(fee.amount)}</Typography>
                  </Stack>
                )) ?? null}
                <Stack justifyContent="space-between" alignItems="center" direction="row">
                  <Typography variant="body2">Udbetalt</Typography>
                  <Typography variant="body2">{fCurrency(settlement.payout_amount)}</Typography>
                </Stack>
                <Stack justifyContent="flex-end" alignItems="center" direction="row">
                  <Button
                    variant="outlined"
                    color="primary"
                    endIcon={<Iconify icon="material-symbols:chevron-right-rounded" />}
                    sx={{ textTransform: 'none' }}
                    onClick={() => router.push(`${PATH_APP.payments.sales.view(settlementId)}#tab=transactions`)}
                  >
                      Se transaktioner
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </CollapsibleCard>
        </Grid>

        <Grid item xs={12}>
          <CollapsibleCard>
              <CardHeader title={
                <Typography variant="h4">Transaktioner</Typography>
              } />
              <CardContent>
                <LatestTransactionsTable solutionId={solutionId} settlementId={settlementId}  />
              </CardContent>
          </CollapsibleCard>
        </Grid>

      </Grid>
    </>
  )
})

export default function GeneralAppPage() {
  
  return (
    <>

      <Head>
        <title>PayPilot | Indløsning</title>
      </Head>
      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>
        <Settlement />
      </Container>
    </>
  );
}
