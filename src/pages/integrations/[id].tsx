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
import { GET_SOLUTION_NAME, GET_SOLUTION_GENERAL_DATA } from 'src/queries/solution';
import { GET_INTEGRATIONS, GET_AVAILABLE_INTEGRATIONS } from 'src/queries/integrations';
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

function RenderStatus(status: boolean) {
  return status ? (
    <Iconify icon="fluent:checkmark-circle-12-filled" sx={{ color: 'success.main' }} />
  ) : (
    <Iconify icon="uis:exclamation-circle" sx={{ color: 'error.main' }} />
  )
}

import _mock from 'src/_mock';
import { randomInArray } from 'src/_mock';

import Scrollbar from 'src/components/scrollbar/Scrollbar';

import SimpleBar from 'simplebar-react'
import dayjs from 'dayjs';

const transactionTypes = {
  'authorization':  'autorisering',
  'capture': 'hævning',
  'payout': 'udbetaling',
  'sale': 'salg', 
}

const TransactionItem = ({ transaction, onClick, selected }) => {

  const successTransaction = transaction.status_code !== 6

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
          <CardHeader title={transactionTypes[transaction.type]} sx={{ textTransform: 'capitalize' }} />
          <CardContent sx={{ pt: 1.5 }}>
            <Stack direction="row" spacing={10} alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ position: 'relative', width: '20px', height: '20px' }}>
                  {successTransaction ? (
                    <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" />
                  ) : (
                    <Iconify icon="uis:exclamation-circle" color="error.main" />
                  )}
                  <Box
                    sx={{
                      backgroundColor: alpha(successTransaction ? theme.palette.success.main : theme.palette.error.main, 0.16),
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
                <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>{fCurrency(transaction.amount)}</Typography>
              </Stack>
              <Avatar sx={{ backgroundColor: 'background.paper', '& .MuiAvatar-img': { objectFit: 'contain', width: '80%', height: '80%' } }} src={img(transaction.source.logo.url)} />
            </Stack>
            <Typography variant="subtitle2" color="text.disabled">{fDateTime(transaction.created_at)}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  )
}

const transactions = {
  1: {
    id: 1,
    type: 'sale',
    amount: 750,
    created_at: dayjs().subtract(3, 'day').subtract(10, 'second'),
    source: {
      type: 'cms',
      logo: {
        url: '/uploads/shopify_f3f609b447.png',
      },
    },
    payment_details: {
      gateway: {
        name: 'ReePay Checkout',
        logo: {
          url: '/uploads/reepay_removebg_preview_933ae6177d.png',
        }
      },
      card: {
        type: 'mobilepay_mastercard_debet',
        pan: '5573 **** **** 4735',
        third_party_provider: {
          logo: {
            url: '/uploads/mobilepay_235aaa708b.svg'
          },
        },
      },
      threeds: true,
    },
    status_code: 1,
    subscription: false,
    reference: 'order-24156',
    note: 'Falkosandwich.dk',
    authorization_id: '1afec885e8ca623d5133b182c210029a',
    bookkeeping_status: true,
  },
  2: {
    id: 2,
    type: 'authorization',
    amount: 750,
    created_at: dayjs().subtract(3, 'day'),
    source: {
      type: 'gateway',
      logo: {
        url: '/uploads/reepay_removebg_preview_933ae6177d.png',
      },
    },
    payment_details: {
      card: {
        type: 'mobilepay_mastercard_debet',
        pan: '5573 **** **** 4735',
        third_party_provider: {
          logo: {
            url: '/uploads/mobilepay_235aaa708b.svg'
          },
        },
      },
      threeds: true,
    },
    status_code: 6,
    subscription: false,
    reference: 'order-24156',
    note: 'Falkosandwich.dk',
    authorization_id: '1afec885e8ca623d5133b182c210029a',
    bookkeeping_status: true,
  },
  3: {
    id: 3,
    type: 'authorization',
    amount: 750,
    created_at: dayjs().subtract(2, 'day'),
    source: {
      type: 'gateway',
      logo: {
        url: '/uploads/reepay_removebg_preview_933ae6177d.png',
      },
    },
    payment_details: {
      card: {
        type: 'mobilepay_mastercard_debet',
        pan: '5573 **** **** 4735',
        third_party_provider: {
          logo: {
            url: '/uploads/mobilepay_235aaa708b.svg'
          },
        },
      },
      threeds: true,
    },
    status_code: 6,
    subscription: false,
    reference: 'order-24156',
    note: 'Falkosandwich.dk',
    authorization_id: '1afec885e8ca623d5133b182c210029a',
    bookkeeping_status: true,
  },
  4: {
    id: 4,
    type: 'authorization',
    amount: 750,
    created_at: dayjs().subtract(1, 'day'),
    source: {
      type: 'gateway',
      logo: {
        url: '/uploads/reepay_removebg_preview_933ae6177d.png',
      },
    },
    payment_details: {
      card: {
        type: 'mobilepay_mastercard_debet',
        pan: '5573 **** **** 4735',
        third_party_provider: {
          logo: {
            url: '/uploads/mobilepay_235aaa708b.svg'
          },
        },
      },
      threeds: true,
    },
    status_code: '001719',
    subscription: false,
    reference: 'order-24156',
    note: 'Falkosandwich.dk',
    authorization_id: '1afec885e8ca623d5133b182c210029a',
    bookkeeping_status: true,
  },
  5: {
    id: 5,
    type: 'capture',
    amount: 750,
    created_at: dayjs().subtract(10, 'hour'),
    source: {
      type: 'gateway',
      logo: {
        url: '/uploads/reepay_removebg_preview_933ae6177d.png',
      },
    },
    payment_details: {
      card: {
        type: 'mobilepay_mastercard_debet',
        pan: '5573 **** **** 4735',
        third_party_provider: {
          logo: {
            url: '/uploads/mobilepay_235aaa708b.svg'
          },
        },
      },
      threeds: true,
    },
    status_code: '001719',
    subscription: false,
    reference: 'order-24156',
    note: 'Falkosandwich.dk',
    authorization_id: '1afec885e8ca623d5133b182c210029a',
    bookkeeping_status: true,
  },
  6: {
      id: 6,
      type: 'payout',
      amount: 750,
      created_at: dayjs().subtract(2, 'hour'),
      source: {
        type: 'acquiring',
        logo: {
          url: '/uploads/elavon_4062d5d98e.png',
        },
      },
      status_code: 20000,
      subscription: false,
      reference: 'order-24156',
      note: 'Falkosandwich.dk',
      settlement_id: '3217216293',
      payment_details: {
        card: {
          type: 'dk_mastercard_debet',
          pan: '5573 **** **** 8467',
          third_party_provider: null,
        },
        threeds: true,
      },
      bookkeeping_status: true,
  },
}

const sourceTypes = {
  acquiring: 'indløsning',
  gateway: 'gateway',
  cms: 'CMS',
}

import { TextField } from '@mui/material';
import ucfirst from 'src/utils/ucfirst';
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
  return type.split('_').join(' ')
}

const sanitizeCardType = (type) => {
  return (
    type.indexOf('mastercard') !== -1 && 'mastercard'
  ) || type
}

const statusCodes = {
  20000: 'godkendt',
  6: 'afvist',
  '001719': 'godkendt',
}
const humanizeStatusCode = (statusCode) => statusCodes[statusCode] ?? statusCode

const TransactionView = React.memo(({ transaction }) => {

  const router = useRouter()

  const selectTransaction = (id) => {
    router.push(PATH_APP.payments.transactions.view(id), undefined, { scroll: false })
  }
  
  const transactionId = transaction.id

  return (
    <>
      <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
        
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={5}>
            <Typography variant="h4">
              Transaktioner: {transactionId}
            </Typography>
            <Label
              variant="soft"
              color="primary"
              sx={{ textTransform: 'capitalize' }}
            >{sourceTypes[transaction.source.type]} (1234568)</Label>
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
              <Avatar sx={{ width: 64, height: 64, backgroundColor: 'background.paper', '& .MuiAvatar-img': { objectFit: 'contain', width: '70%', height: '70%' } }} src={img(transaction.source.logo.url)} />
              <Box>
                <Typography variant="h4" color="common.white">{fCurrency(750)}</Typography>
                <Typography variant="subtitle2" color="common.white" sx={{ fontWeight: 'light', textTransform: 'capitalize' }}>
                  {transactionTypes[transactions[transactionId].type]}
                </Typography>
              </Box>
              {transaction.status_code === 6 ? (
                <Iconify icon="uis:exclamation-circle" color="common.white" width="115%" sx={{ opacity: 0.25, position: 'absolute', right: '-52.5%', top: '-7%' }} />
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
                  <Typography variant="body2" sx={{ p: 2 }}>{fDateTime(transaction.created_at)}</Typography>
                </Stack>
              </Stack>
              <Stack sx={{ flexGrow: 1, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ backgroundColor: 'background.neutral', p: 2 }}>Betalingskort</Typography>
                <Stack sx={{ height: '100%', p: 2 }} justifyContent="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon="material-symbols:info-outline-rounded" />
                    <Avatar src={
                      transaction.payment_details.gateway ? (
                        img(transaction.payment_details.gateway.logo.url)
                      ) : (
                        transaction.payment_details.card.third_party_provider ? (
                          img(transaction.payment_details.card.third_party_provider.logo.url)
                        ) : getCardLogoUrl(sanitizeCardType(transaction.payment_details.card.type))
                      )
                    } sx={{ backgroundColor: 'background.paper', '& .MuiAvatar-img': { objectFit: 'contain', width: '80%', height: '80%' } }} />
                    {transaction.source.type === 'cms' ? (
                      <>
                        <Tooltip title={transaction.payment_details.gateway.name} describeChild>
                          <Typography>{transaction.payment_details.gateway.name}</Typography>
                        </Tooltip>
                        <Button sx={{ textTransform: 'none', py: 0.25, px: 1 }} variant="soft" onClick={() => router.push(PATH_APP.payments.sales.view(transaction.id))}>Se salg</Button>
                      </>
                    ) : (
                      <Tooltip title={transaction.payment_details.card.pan} describeChild>
                        <Typography>{transaction.payment_details.card.pan}</Typography>
                      </Tooltip>
                    )}
                  </Stack>
                </Stack>
              </Stack>
              {transaction.source.type !== 'cms' && (
                <Stack sx={{ height: '100%' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ backgroundColor: 'background.neutral', p: 2 }}>3DS</Typography>
                  <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
                    {RenderStatusLabel(transaction.payment_details.treeds)}
                  </Stack>
                </Stack>
              )}
              <Stack sx={{ height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ backgroundColor: 'background.neutral', p: 2 }}>Bogført</Typography>
                <Stack sx={{ height: '100%' }} justifyContent="center" alignItems="center">
                  {RenderStatus(transaction.bookkeeping_status)}
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
                      <Fieldset legend="Statuskode">{transaction.status_code}</Fieldset>
                      <Fieldset legend="Statusbesked">{humanizeStatusCode(transaction.status_code)}</Fieldset>
                      <Fieldset legend="Abonnement">{transaction.subscription ? 'ja' : 'nej'}</Fieldset>
                      <Fieldset legend="Betalingsform">{humanizeCardType(transaction.payment_details.card.type)}</Fieldset>
                      <Fieldset legend="ID">{transactionId}</Fieldset>
                      <Fieldset legend="Reference">{transaction.reference}</Fieldset>
                    </Box>
                    <Box
                      rowGap={3}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        md: 'repeat(2, 1fr)',
                      }}
                      sx={{
                        pt: 3,
                      }}
                    >
                      <Fieldset legend="Navn på banktransaktion">Falkosandwich.dk</Fieldset>
                      <Fieldset legend={transaction.source.type === 'acquiring' ? 'Afregnings-ID' : 'Autoriserings-ID'}>248943849389</Fieldset>
                    </Box>
              </CardContent>
            </CollapsibleCard>
        </Grid>

        {transaction.source.type === 'acquiring' && (
          <Grid item xs={12}>
            <CollapsibleCard>
              <CardHeader title={
                <Typography variant="h4">Afregning</Typography>
              } />
              <CardContent>
                <Stack spacing={3}>
                  <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <Typography variant="body2">Transaktionsbeløb brutto</Typography>
                    <Typography variant="body2">{fCurrency(750)}</Typography>
                  </Stack>
                  <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <Typography variant="body2">Transaktionsgebyr</Typography>
                    <Typography variant="body2">{fCurrency(-7.5)}</Typography>
                  </Stack>
                  <Stack justifyContent="space-between" alignItems="center" color="grey.500" direction="row">
                    <Typography variant="body2">- Hævning</Typography>
                    <Typography variant="body2">{fCurrency(-7.5)}</Typography>
                  </Stack>
                  <Stack justifyContent="space-between" alignItems="center" direction="row">
                    <Typography variant="body2">Transaktionsbeløb netto</Typography>
                    <Typography variant="body2">{fCurrency(742.5)}</Typography>
                  </Stack>
                  <Stack justifyContent="flex-end" alignItems="center" direction="row">
                    <Button
                      variant="outlined"
                      color="primary"
                      endIcon={<Iconify icon="material-symbols:chevron-right-rounded" />}
                      sx={{ textTransform: 'none' }}
                      onClick={() => router.push(PATH_APP.payments.settlements.view(transactionId))}
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
            <Typography variant="h4" sx={{ pb: 3 }}>Transaktionsspor</Typography>
            <Divider />
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
          </Box>
        </Grid>

      </Grid>
    </>
  )
})

export default function GeneralAppPage() {
  
  const router = useRouter()
  const transactionId = parseInt(router.query.id, 10)

  const transaction = transactions[transactionId]

  return (
    <>

      <Head>
        <title>PayPilot | Transaktion</title>
      </Head>

      {transaction && (
          <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>
            <TransactionView transaction={transaction} />
          </Container>
          
      )}

    </>
  );
}
