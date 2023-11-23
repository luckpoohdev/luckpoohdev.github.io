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

import { CircularProgress, AvatarGroup, Avatar } from '@mui/material';
import img from 'src/utils/img';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import useConfirmDialog from 'src/hooks/useConfirmDialog';
import AllSales from 'src/components/sales/all';
import Dialog from 'src/components/custom-dialog';
import { AcquiringServiceCard, GatewayServiceCard } from 'src/components/service-card';
import { _userCards } from 'src/_mock/arrays';
import OrderDetails from 'src/sections/@dashboard/sales/details'
import Label from 'src/components/label/Label';
import { fDateTime, fDate } from 'src/utils/formatTime';
import CollapsibleCard from 'src/components/collapsible-card';
import Icon from 'src/components/Icon';

import { GET_TRANSACTION, GET_TRANSACTION_TRACK } from 'src/queries/transaction';

import { TRANSACTION_TYPES, TRANSACTION_STATUSES } from 'src/config-global';

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

function RenderBookkeepingStatus(status: boolean) {
  return (
    (!status) ? <Icon name="ic_clock" color="warning.main" width="21px" height="21px" /> : <Iconify icon="fluent:checkmark-circle-12-filled" sx={{ color: 'success.main' }} />
  )
}

import _mock from 'src/_mock';
import { randomInArray } from 'src/_mock';

import Scrollbar from 'src/components/scrollbar/Scrollbar';

import SimpleBar from 'simplebar-react'
import dayjs from 'dayjs';

const TransactionItem = ({ transaction, onClick, selected }) => {
  
  const successTransaction = transaction.status === 'completed';

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
        <CardActionArea onClick={() => typeof onClick === 'function' ? onClick(transaction.id) : null}>
          <CardHeader title={TRANSACTION_TYPES[transaction.type]} sx={{ textTransform: 'capitalize' }} />
          <CardContent sx={{ pt: 1.5 }}>
            <Stack direction="row" spacing={10} alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Tooltip title={TRANSACTION_STATUSES[transaction.status]} componentsProps={{
                  tooltip: {
                    sx: { textTransform: 'capitalize' },
                  },
                }}>
                  <Box sx={{ position: 'relative', width: '20px', height: '20px' }}>
                    {successTransaction ? (
                      <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" />
                    ) : (transaction.status === 'cancelled' ? (
                        <Iconify icon="material-symbols:cancel" color="grey.600" />
                    ) : (
                      <Iconify icon="uis:exclamation-circle" color="error.main" />
                    ))}
                    <Box
                      sx={{
                        backgroundColor: alpha(successTransaction ? theme.palette.success.main : (transaction.status === 'cancelled' ? theme.palette.grey[400] : theme.palette.error.main), 0.16),
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
                </Tooltip>
                <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>{fCurrency(transaction.amount)}</Typography>
              </Stack>
              <Avatar sx={{ backgroundColor: 'background.paper', '& .MuiAvatar-img': { objectFit: 'contain', width: '80%', height: '80%' } }} src={transaction?.integration_logo_url ? img(transaction?.integration_logo_url) : null} />
            </Stack>
            <Typography variant="subtitle2" color="text.disabled">{fDateTime(transaction.transacted_at)}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  )
}

const sourceTypes = {
  acquirer: 'indløsning',
  gateway: 'gateway',
  cms: 'CMS',
}

import { TextField } from '@mui/material';
import ucfirst from 'src/utils/ucfirst';
import CenteredLoadingIndicator from '@/components/centered-loading-indicator';
import getCardLogoUrl from '@/utils/getCardLogoUrl';

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
  return type?.split('_')?.join(' ')
}

const sanitizeCardType = (type) => {
  return (
    type?.indexOf('mastercard') !== -1 && 'mastercard'
  ) || type
}

const statusCodes = {
  'completed': 'Godkendt',
  'failed': 'Fejlet',
  'cancelled': 'Annulleret',
}
const humanizeStatusCode = (statusCode) => statusCodes[statusCode] ?? statusCode

const TransactionTrack = ({ transactionId, solutionId, referenceId }) => {
  const router = useRouter()
  const trackQuery = useQuery(GET_TRANSACTION_TRACK, {
    variables: {
      referenceId,
      solutionId,
    }
  })
  const transactions = trackQuery?.data ?? []
  const selectTransaction = (id) => {
    router.push(PATH_APP.payments.transactions.view(`${solutionId},${id}`), undefined, { scroll: false })
  }
  return trackQuery.loading ? (
    <CenteredLoadingIndicator height="150px" />
  ) : (
    <SimpleBar style={{ height: '195px', width: '100%' }}>
      {({ scrollableNodeRef, contentNodeRef }) => // unused unless u have to change the default class name (.simplebar-content-wrapper and .simplebar-content)
        <ScrollContainer
          className="simplebar-content-wrapper"
          horizontal
          vertical={false}
        >
          <div className="simplebar-content">
            <Stack direction="row" sx={{ px: '3px' }} spacing={4}>
                {Object.values(transactions).map((transaction, index) => (
                  <TransactionItem
                    key={index}
                    transaction={transaction}
                    onClick={(id) => selectTransaction(id)}
                    selected={transactionId === transaction.id}
                  />
                ))}
            </Stack>
          </div>
        </ScrollContainer>
      }
    </SimpleBar>
  )
}

const RenderFeeType = (fee_type) => {
  switch (fee_type) {
    case 'refund': return 'Refundering';
    case 'settlement': return 'Hævning';
  }
}

const TransactionView = React.memo(() => {

  const router = useRouter();
  const solutionId = parseInt(router.query?.id?.split(',')?.[0], 10)
  const transactionId = router.query?.id?.split(',')?.[1];
  const transactionQuery = useQuery(GET_TRANSACTION, {
    variables: {
      id: transactionId,
      solution_id: solutionId,
    }
  })

  const transaction = transactionQuery.data ?? {}

  const maskedCcNum = transaction.masked_card_number ? <Stack direction="row" spacing={1}>{`XXXXXXXXXXXXXXXX${transaction.masked_card_number}`.slice(-16).match(/.{4}/g).map((block) => <Box>{block}</Box>)}</Stack> : null

  const successTransaction = transaction.status === 'completed'

  return transactionQuery.loading ? <CenteredLoadingIndicator /> : (
    <>
      <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
        
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={5}>
            <Typography variant="h4">
              Transaktioner: {transactionId}
            </Typography>
            {sourceTypes[transaction.source_type]} {transaction.mid ? (
              <Label
                variant="soft"
                color="primary"
                sx={{ textTransform: 'capitalize' }}
              >Indløsning ({transaction.mid})</Label>
            ) : null}
          </Stack>
          <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
            Se transaktionsdetaljer forneden
          </Typography>
        </Grid>
      </Grid>

      <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
        <Grid item xs={12} lg={4} xl={3}>
          <Card sx={{ backgroundColor: 'primary.main', px: 1, py: 2 }}>
            <CardContent component={Stack} direction="row" spacing={3} sx={{ position: 'relative' }}>
              <Avatar sx={{ width: 64, height: 64, backgroundColor: 'background.paper', '& .MuiAvatar-img': { objectFit: 'contain', width: '70%', height: '70%' } }} src={transaction?.integration_logo_url ? img(transaction?.integration_logo_url) : null} />
              <Box>
                <Typography variant="h4" color="common.white">{fCurrency(transaction.amount)}</Typography>
                <Typography variant="subtitle2" color="common.white" sx={{ fontWeight: 'light', textTransform: 'capitalize' }}>
                  {TRANSACTION_TYPES[transaction.type]}
                </Typography>
              </Box>
              {!successTransaction ? (
                (transaction.status === 'cancelled' ? (
                  <Iconify icon="material-symbols:cancel" color="common.white" width="115%" sx={{ opacity: 0.25, position: 'absolute', right: '-52.5%', top: '-7%' }} />
                ) : <Iconify icon="uis:exclamation-circle" color="common.white" width="115%" sx={{ opacity: 0.25, position: 'absolute', right: '-52.5%', top: '-7%' }} />)
              ) : (
                <Iconify icon="fluent:checkmark-circle-12-filled" color="common.white" width="115%" sx={{ opacity: 0.25, position: 'absolute', right: '-52.5%', top: '-7%' }} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={8} xl={9}>
          <Card sx={{ p: 0, height: '100%' }}>
            <CardContent component={Stack} direction="row" sx={{ height: '100%', p: 0, '&:last-child': { p: 0 } }}>
              <Stack sx={{ flexGrow: 1, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ backgroundColor: 'background.neutral', p: 2 }}>Dato</Typography>
                <Stack sx={{ height: '100%' }} justifyContent="center">
                  <Typography variant="body2" sx={{ p: 2 }}>{fDateTime(transaction.transacted_at)}</Typography>
                </Stack>
              </Stack>
              <Stack sx={{ flexGrow: 1, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ backgroundColor: 'background.neutral', p: 2 }}>Betalingskort</Typography>
                <Stack sx={{ height: '100%', p: 2 }} justifyContent="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon="material-symbols:info-outline-rounded" />
                    <Avatar src={getCardLogoUrl(sanitizeCardType(transaction.card_type))} sx={{ backgroundColor: 'background.paper', '& .MuiAvatar-img': { objectFit: 'contain', width: '80%', height: '80%' } }} />
                    <Tooltip title={maskedCcNum} describeChild>
                          <Typography>{maskedCcNum}</Typography>
                    </Tooltip>
                    {(transaction.type === 'authorization' && transaction.sale_id) && (
                      <Button sx={{ textTransform: 'none', py: 0.25, px: 1 }} variant="soft" onClick={() => router.push(PATH_APP.payments.sales.view(`${transaction.store_id},${transaction.sale_id}`))}>Se salg</Button>
                    )}
                  </Stack>
                </Stack>
              </Stack>
              {transaction.source_type !== 'cms' && (
                <Stack sx={{ height: '100%' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ backgroundColor: 'background.neutral', p: 2 }}>3DS</Typography>
                  <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
                    {RenderStatusLabel(transaction.sca)}
                  </Stack>
                </Stack>
              )}
              <Stack sx={{ height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ backgroundColor: 'background.neutral', p: 2 }}>Bogført</Typography>
                <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
                  {transaction.type === 'authorization' ? <>&hellip;</> : RenderBookkeepingStatus(transaction.bookkeeping_status)}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
            <CollapsibleCard>
              <CardHeader title={
                <Typography variant="h4">Transaktionsdetaljer</Typography>
              } />
              <CardContent>
              <Box
                      rowGap={3.5} columnGap={{ xs: 3.5, md: 5 }}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        md: 'repeat(3, 1fr)',
                      }}
                      sx={{
                        pt: 1,
                      }}
                    >
                      <Fieldset legend="Statuskode">{String(transaction.status_code)}</Fieldset>
                      <Fieldset legend="Statusbesked">{humanizeStatusCode(transaction.status)}</Fieldset>
                      <Fieldset legend="Abonnement">{transaction.subscription ? 'ja' : 'nej'}</Fieldset>
                      <Fieldset legend="Betalingsform">{humanizeCardType(`${transaction.card_type} ${transaction.sub_brand}`)}</Fieldset>
                      <Fieldset legend="ID">{transactionId}</Fieldset>
                      <Fieldset legend="Reference">{transaction.reference_id}</Fieldset>
                      {['payout','return'].indexOf(transaction.type) !== -1 && (
                        <>
                          <Fieldset legend="Afregnings-ID">{transaction.settlement_id}</Fieldset>
                          <Fieldset legend="Navn på banktransaktion">{transaction.bank_statement_id}</Fieldset>
                        </>
                      )}
                    </Box>
              </CardContent>
            </CollapsibleCard>
        </Grid>

        {transaction.type === 'payout' && (
          <Grid item xs={12}>
            <CollapsibleCard>
              <CardHeader title={
                <Typography variant="h4">Afregning</Typography>
              } />
              <CardContent>
                <Stack spacing={3}>
                  <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <Typography variant="body2">Transaktionsbeløb brutto</Typography>
                    <Typography variant="body2">{fCurrency(transaction.amount+transaction.total_amount_fees)}</Typography>
                  </Stack>
                  <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <Typography variant="body2">Transaktionsgebyr</Typography>
                    <Typography variant="body2">{fCurrency((transaction.total_amount_fees)*-1)}</Typography>
                  </Stack>
                  {transaction?.fees?.map((fee) => (
                    <Stack justifyContent="space-between" alignItems="center" color="grey.500" direction="row">
                      <Typography variant="body2">- {RenderFeeType(fee.fee_type)}</Typography>
                      <Typography variant="body2">-{fCurrency(fee.amount)}</Typography>
                    </Stack>
                  )) ?? null}
                  <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <Typography variant="body2">Transaktionsbeløb netto</Typography>
                    <Typography variant="body2">{fCurrency(transaction.amount)}</Typography>
                  </Stack>
                  <Stack justifyContent="flex-end" alignItems="center" direction="row">
                    <Button
                      variant="outlined"
                      color="primary"
                      endIcon={<Iconify icon="material-symbols:chevron-right-rounded" />}
                      sx={{ textTransform: 'none' }}
                      onClick={() => router.push(PATH_APP.payments.settlements.view(`${solutionId},${transaction.settlement_id}`))}
                    >
                        Se afregning
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </CollapsibleCard>
          </Grid>
        )}
            
        <Grid item xs={12}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ pb: 3 }}>Tidslinje</Typography>
            <Divider />
            <TransactionTrack transactionId={transaction.id} solutionId={solutionId} referenceId={transaction.reference_id} />
          </Box>
        </Grid>

      </Grid>
    </>
  )
})

export default function GeneralAppPage() {
  
  return (
    <>
      <Head>
        <title>PayPilot | Transaktion</title>
      </Head>
      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>
          <TransactionView />
      </Container>
    </>
  );
}
