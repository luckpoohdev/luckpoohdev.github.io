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
  Box,
  CardMedia,
} from '@mui/material';
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

import { fPercent } from 'src/utils/formatNumber';
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
import { GET_SOURCE_ID_BY_ID } from 'src/queries/sale';
// hooks
import { useQuery } from 'src/hooks/apollo';
// ----------------------------------------------------------------------

import { CircularProgress, AvatarGroup, Avatar } from '@mui/material';
import img from 'src/utils/img';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import useConfirmDialog from 'src/hooks/useConfirmDialog';
import AllTransactions from 'src/components/transactions/all';
import Dialog from 'src/components/custom-dialog';
import { AcquiringServiceCard, GatewayServiceCard } from 'src/components/service-card';
import { _userCards } from 'src/_mock/arrays';
import OrderDetails from 'src/sections/@dashboard/sales/details'

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

const AcquiringServiceDialog = ({ open, onClose, onSave }) => {
  const router = useRouter()
  const idRef = useRef(null)
  if (!idRef.current || open) idRef.current = parseInt(router.hashParams.get('acquiring_service'), 10)
  const service = useQuery(GET_ACQUIRING_SERVICE, { variables: { id: idRef.current } })
  const name = (service.data?.provider ?? service.data?.partner)?.name
  return (
    <Dialog open={open} maxWidth="lg" onClose={onClose} fullWidth={true}>
      {service.loading ? <CircularProgress /> : (service.data && (
        <>
          <DialogTitle>{name}</DialogTitle>
          <DialogContent sx={{ overflow: 'visible' }}>
            <DialogContentText>Indløsningsaftale</DialogContentText>
            <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 3.5 }}>
              <Grid item xs={12} sx={{ pt: 0 }}>Her kommer data om den specfikke indløsningsaftale.</Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} variant="contained">Luk</Button>
          </DialogActions>
        </>
      ))}
    </Dialog>
  )
}

const GatewayServiceDialog = ({ open, onClose, onSave }) => {
  const router = useRouter()
  const idRef = useRef(null)
  if (!idRef.current || open) idRef.current = parseInt(router.hashParams.get('gateway_service'), 10)
  const service = useQuery(GET_GATEWAY_SERVICE, { variables: { id: idRef.current } })
  const name = (service.data?.provider ?? service.data?.partner)?.name
  return (
    <Dialog open={open} maxWidth="lg" onClose={onClose} fullWidth={true}>
      {service.loading ? <CircularProgress /> : service.data && (
        <>
          <DialogTitle>{name}</DialogTitle>
          <DialogContent sx={{ overflow: 'visible' }}>
            <DialogContentText>Gateway aftale</DialogContentText>
            <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 3.5 }}>
              <Grid item xs={12} sx={{ pt: 0 }}>Her kommer data om den specfikke gateway aftale.</Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} variant="contained">Luk</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

const TerminalServiceDialog = ({ open, onClose, onSave }) => {
  const router = useRouter()
  const idRef = useRef(null)
  if (!idRef.current || open) idRef.current = parseInt(router.hashParams.get('terminal_service'), 10)
  const service = useQuery(GET_TERMINAL_SERVICE, { variables: { id: idRef.current } })
  const name = (service.data?.provider ?? service.data?.partner)?.name
  return (
    <Dialog open={open} maxWidth="lg" onClose={onClose} fullWidth={true}>
      {service.loading ? <CircularProgress /> : service.data && (
        <>
          <DialogTitle>{name}</DialogTitle>
          <DialogContent sx={{ overflow: 'visible' }}>
            <DialogContentText>Terminalaftale</DialogContentText>
            <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 3.5 }}>
              <Grid item xs={12} sx={{ pt: 0 }}>Her kommer data om den specfikke terminalaftale.</Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} variant="contained">Luk</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

const GeneralTab = () => {
  
  const [ mounted, setMounted] = useState(false)
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar();
  const storePageTabActionButtonRef = useRef(null)

  const solution = useQuery(GET_SOLUTION_GENERAL_DATA, { variables: { id: parseInt(router.query.id, 10) } })

  const [ deleteSolution, ConfirmDeleteSolutionDialog ] = useConfirmDialog({
    onConfirm: () => null,
  })

  const TabActionPopover = usePopover()

  const methods = useForm();

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      //enqueueSnackbar('Dine ændringer blev gemt!');
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!mounted) {
      storePageTabActionButtonRef.current = document.getElementById('storePageTabActionButton')
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (solution?.data) {
      methods.reset({
        name: solution.data.name,
        type: solution.data.type,
      })
    }
  }, [ solution?.data ])

  return (
    <>

      {storePageTabActionButtonRef.current && ReactDOM.createPortal((
        <TabActionPopover.Component control={<CustomButton icon={<Iconify icon="fluent:chevron-down-20-filled" />}>Handling</CustomButton>}>
          <MenuItem onClick={deleteSolution}>Slet</MenuItem>
        </TabActionPopover.Component>
      ), storePageTabActionButtonRef.current)}

      <ConfirmDeleteSolutionDialog
        title="Slet betalingsløsning?"
        confirmLabel="Slet"
        confirmColor="error"
      >
        <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette denne betalingsløsning?</Typography>
        <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
      </ConfirmDeleteSolutionDialog>

      <AcquiringServiceDialog open={router.hashParams.get('acquiring_service')} onClose={() => router.updateHashParams({
        acquiring_service: null,
        gateway_service: null,
        terminal_service: null,
      })} onSave={() => router.updateHashParams({
        acquiring_service: null,
        gateway_service: null,
        terminal_service: null
      })} />

      <GatewayServiceDialog open={router.hashParams.get('gateway_service')} onClose={() => router.updateHashParams({
        acquiring_service: null,
        gateway_service: null,
        terminal_service: null,
      })} onSave={() => router.updateHashParams({
        acquiring_service: null,
        gateway_service: null,
        terminal_service: null
      })} />

      <TerminalServiceDialog open={router.hashParams.get('terminal_service')} onClose={() => router.updateHashParams({
        acquiring_service: null,
        gateway_service: null,
        terminal_service: null,
      })} onSave={() => router.updateHashParams({
        acquiring_service: null,
        gateway_service: null,
        terminal_service: null
      })} />
      
      <Grid item xs={12}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Navn" />

              <RHFTextField name="type" label="Type" />

            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>

              <LoadingButton type="submit" variant="contained" loading={false}>
                Gem
              </LoadingButton>
            </Stack>
          </Card>
        </FormProvider>
      </Grid>

      {solution?.data?.acquiring_services?.map((acquiringService) => (
        <Grid item key={acquiringService.id} xs={12} md={4}>
          <AcquiringServiceCard service={acquiringService} />
        </Grid>
      ))}
      {solution?.data?.gateway_service && (
        <Grid item key={solution?.data?.gateway_service.id} xs={12} md={4}>
          <GatewayServiceCard service={solution?.data?.gateway_service} />
        </Grid>
      )}
    </>
  )
}

import _mock from 'src/_mock';
import { randomInArray } from 'src/_mock';
import CenteredLoadingIndicator from '@/components/centered-loading-indicator';

const SalesTab = () => {
  const router = useRouter()
  return (
    <Grid item xs={12} sx={{ height: '60vh' }}>
      <AllSales merchantId={parseInt(router.hashParams.get('merchant'), 10)} />
    </Grid>
  )
}

const NewIntegrationDialog = ({ open, onClose, onSave }) => {
  const router = useRouter()
  const integrations = useQuery(GET_AVAILABLE_INTEGRATIONS, { variables: { solutionId: parseInt(router.query.id, 10) } })
  return (
    <Dialog open={open} maxWidth="lg" onClose={onClose} fullWidth={true}>
      <DialogTitle>Opret ny integration</DialogTitle>
      <DialogContent sx={{ overflow: 'visible' }}>
        <DialogContentText>
          Vælg en integration til din betalingsløsning fra listen.
        </DialogContentText>
        {!integrations.data ? <CircularProgress /> : (
          <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 3.5 }}>
            {integrations.data.map((integration) => {
              return (
                <Grid item xs={12} md={4} sx={{ pt: 0 }}>
                  <Card>
                    <CardActionArea onClick={(e) => {
                      if ((e?.target?.className?.indexOf('MuiModal') ?? -1) !== -1) return true
                      router.updateHashParams({
                        new_integration: null,
                      })
                    }}>
                      <Stack sx={{ width: '100%', height: '140px', backgroundColor: integration.color }} alignItems="center" justifyContent="center">
                        <CardMedia
                          component="img"
                          sx={{ height: '50%', objectFit: 'contain' }}
                          image={img(integration.logo.url)}
                          title={integration.name}
                        />
                      </Stack>
                      <CardContent sx={{ py: 1.75 }}>
                        <Typography variant="h6" color="text.primary" sx={{ textAlign: 'center' }}>
                          {integration.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Luk</Button>
      </DialogActions>
    </Dialog>
  )
}

const IntegrationsTab = () => {
  const [ mounted, setMounted] = useState(false)
  const router = useRouter()
  const storePageTabActionButtonRef = useRef(null)
  const TabActionPopover = usePopover()
  const { stores } = useSelector((state) => ({
    stores: state.merchant.userMerchants[router.hashParams.get('merchant')].stores,
  }))
  const integrations = useQuery(GET_INTEGRATIONS, { variables: { solutionId: parseInt(router.query.id, 10) } })
  const [ deleteIntegration, ConfirmDeleteIntegrationDialog ] = useConfirmDialog({
    onConfirm: () => null,
  })
  useEffect(() => {
    if (!mounted) {
      storePageTabActionButtonRef.current = document.getElementById('storePageTabActionButton')
      setMounted(true)
    }
  }, [])
  return (
    <>
      {mounted && ReactDOM.createPortal((
        <TabActionPopover.Component control={<CustomButton icon={<Iconify icon="fluent:chevron-down-20-filled" />}>Handling</CustomButton>}>
          <MenuItem onClick={() => {
            router.updateHashParams({
              new_integration: 1,
            })
          }}>Opret ny integration</MenuItem>
        </TabActionPopover.Component>
      ), storePageTabActionButtonRef.current)}

      <ConfirmDeleteIntegrationDialog
        title="Slet integration?"
        confirmLabel="Slet"
        confirmColor="error"
      >
        <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette denne integration?</Typography>
        <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
      </ConfirmDeleteIntegrationDialog>

      <NewIntegrationDialog open={router.hashParams.get('new_integration')} onClose={() => router.updateHashParams({ new_integration: null })} onSave={() => router.updateHashParams({ new_integration: null })} />
    
      {!integrations.data ? <CircularProgress /> : (
        integrations.data.map((integration, index) => {
          integration = {
            ...integration.integration,
            id: integration.id,
          }
          integration.completionPercent = 100
          return (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardActionArea onClick={(e) => {
                  if ((e?.target?.className?.indexOf('MuiModal') ?? -1) !== -1) return true
                  router.push(PATH_APP.integrations.view(integration.id))
                }}>
                  <CardHeader
                    avatar={
                      <Avatar
                        alt={integration.name}
                        src={img(integration.logo.url)}
                        sx={{
                          '& .MuiAvatar-img': {
                            objectFit: 'contain',
                          },
                        }}
                      />
                    }
                    action={
                      <MoreActionsButton
                        actions={[
                          { label: 'Slet', onClick: deleteIntegration },
                        ]}
                      />
                    }
                  />
                  <CardContent>
                    <Typography variant="h6" color="text.primary">
                      {integration.name}
                    </Typography>
                    <LinearProgress
                      value={integration.completionPercent}
                      variant="determinate"
                      color={integration.completionPercent < 100 ? (integration.completionPercent >= 50 && integration.completionPercent < 100 ? 'warning' : 'error') : 'success'}
                      sx={{
                        my: 2,
                        height: 6,
                        '&::before': {
                          bgcolor: 'background.neutral',
                          opacity: 1,
                        },
                      }}
                    />

                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Box component="span" sx={{ typography: 'body2', color: 'text.disabled' }}>{fPercent(integration.completionPercent)}</Box>
                      <Box component="span" sx={{ typography: 'subtitle2' }}>/ 100%</Box>
                    </Stack>

                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )
        })
      )}
    </>
  )
}

const BookkeepingTab = () => {
  const [ mounted, setMounted] = useState(false)
  const router = useRouter()
  const storePageTabActionButtonRef = useRef(null)
  const TabActionPopover = usePopover()
  const { stores } = useSelector((state) => ({
    stores: state.merchant.userMerchants[router.hashParams.get('merchant')].stores,
  }))
  const solutions = { data: [{}] }
  const [ deleteSolution, ConfirmDeleteSolutionDialog ] = useConfirmDialog({
    onConfirm: () => alert('Under udvikling...'),
  })
  useEffect(() => {
    if (!mounted) {
      storePageTabActionButtonRef.current = document.getElementById('storePageTabActionButton')
      setMounted(true)
    }
  }, [])
  const createNewSolution = (type) => {
    router.updateHashParams({
      new_solution: type,
    })
  }
  return (
    <>

      <ConfirmDeleteSolutionDialog
        title="Slet betalingsløsning?"
        confirmLabel="Slet"
        confirmColor="error"
      >
        <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette din betalingsløsning?</Typography>
        <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
      </ConfirmDeleteSolutionDialog>
      
      {!solutions.data ? (
        <Grid item xs={12} md={4}>
          <CircularProgress />
          </Grid>
      ) : (solutions.data.map((solution, index) => {
        solution.completionPercent = 100
        return (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardActionArea onClick={(e) => {
                if ((e?.target?.className?.indexOf('MuiModal') ?? -1) !== -1) return true
                router.push(PATH_APP.stores.view(solution.id))
              }}>
                <CardHeader
                  avatar={
                    <AvatarGroup max={4}>
                      <Avatar
                        alt={""}
                        src={""}
                      />
                      <Avatar
                        alt={""}
                        src={""}
                      />
                      <Avatar
                        alt={""}
                        src={""}
                      />
                    </AvatarGroup>
                  }
                  action={
                    <MoreActionsButton
                      actions={[
                        { label: 'Slet', onClick: deleteSolution },
                      ]}
                    />
                  }
                />
                <CardContent>
                  <Typography variant="h6" color="text.primary">
                    {solution.name}
                  </Typography>
                  <LinearProgress
                    value={solution.completionPercent}
                    variant="determinate"
                    color={solution.completionPercent < 100 ? (solution.completionPercent >= 50 && solution.completionPercent < 100 ? 'warning' : 'error') : 'success'}
                    sx={{
                      my: 2,
                      height: 6,
                      '&::before': {
                        bgcolor: 'background.neutral',
                        opacity: 1,
                      },
                    }}
                  />

                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Box component="span" sx={{ typography: 'body2', color: 'text.disabled' }}>{fPercent(solution.completionPercent)}</Box>
                    <Box component="span" sx={{ typography: 'subtitle2' }}>/ 100%</Box>
                  </Stack>

                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )
      }))}
    </>
  )
}

const TabContent = ({ component }: { component: React.ReactElement }) => {
  const Component = component
  return (
    <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
      <Component />
    </Grid>
  )
}

const OrderDetailsTab = () => {
  const router = useRouter()
  const storeId = parseInt(router.query.id.split(',')[0], 10);
  const saleId = router.query.id.split(',')[1];
  return (
    <Grid item xs={12}>
      <OrderDetails saleId={saleId} storeId={storeId} />
    </Grid>
  )
}

const TransactionsTab = () => {
  const router = useRouter();
  const storeId = router.query.id.split(',')[0];
  const saleId = router.query.id.split(',')[1];
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);
  return (
    <Grid item xs={12} sx={{ height: '60vh' }}>
      <AllTransactions sort="asc" merchantId={merchantId} storeId={storeId} saleId={saleId} rowActions={[
        { label: 'Vis transaktion', onClick: (params) => router.push(PATH_APP.payments.transactions.view(params.id)) },
      ]} />
    </Grid>
  )
}

const TABS = {
  details: {
    label: 'Ordredetaljer',
    icon: <Iconify icon="mdi:paper" sx={{ mr: 1 }} />,
    component: React.memo(OrderDetailsTab),
  },
  transactions: {
    label: 'Transaktioner',
    icon: <Iconify icon="material-symbols:receipt" sx={{ mr: 1 }} />,
    component: React.memo(TransactionsTab),
  },
}

export default function GeneralAppPage() {
  
  const router = useRouter()
  const saleId = router.query.id.split(',')[1];
  const selectedTab = router.hashParams.get('tab') ?? 'details'
  const { user } = useAuthContext()
  
  const [ createNewStoreType, setCreateNewStoreType ] = useState(false)

  const theme = useTheme()

  const { themeStretch } = useSettingsContext()

  return (
    <>

      <Head>
        <title>PayPilot | Salg</title>
      </Head>

      <TabContext value={selectedTab}>
          <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>
            <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
              
              <Grid item xs={12}>
                <Typography variant="h4">
                  Salg: {saleId}
                </Typography>
                <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
                  Se detaljer og transaktioner for dit salg forneden
                </Typography>
              </Grid>
            </Grid>

            <Grid container xs={12} sx={{ pt: 1.75 }}>

              <Grid item xs={12} md={8} display="flex" alignItems="center" spacing={1}>
                <TabList onChange={(e, value) => router.updateHashParams({ tab: value })}>
                    {Object.keys(TABS).map((tabId) => <Tab key={tabId} label={<>{TABS[tabId].icon} {TABS[tabId].label}</>} value={tabId} />)}
                </TabList>
              </Grid>

              <Grid item xs={12} md={4} display="flex" justifyContent="flex-end" alignItems="center" spacing={1} id="storePageTabActionButton"></Grid>
            </Grid>

          </Container>
          {Object.keys(TABS).map((tabId) => (
            <TabPanel key={tabId} value={tabId} sx={{ pt: 3, position: 'relative' }} classes="MuiContainer-root">
              <TabContent component={TABS[tabId].component} />
            </TabPanel>
          ))}
        </TabContext>

    </>
  );
}
