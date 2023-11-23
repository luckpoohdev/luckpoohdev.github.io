// react
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { useState, useEffect, useRef, useMemo } from 'react'
// apollo
import { useMutation } from '@apollo/client'
// next
import Head from 'next/head';
import Link from 'next/link';
// hook form
import { useWatch, useFormState } from 'react-hook-form'
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Typography,
  LinearProgress,
  Stack,
  Box,
} from '@mui/material';
// framer
import { useIsomorphicLayoutEffect } from 'framer-motion';
// network
import axios from 'axios';
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
// assets
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
import { RHFSwitch, RHFTextField, RHFSelect, RHFCountrySelect, RHFAutocomplete, RHFRadioGroup } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import useRouter from 'src/hooks/useRouter';
import { countries } from 'src/assets/data';
// queries
import { GET_STORE_GENERAL_DATA, GET_STORE_INTEGRATIONS, GET_AVAILABLE_INTEGRATIONS } from 'src/queries/store';
import { GET_MERCHANT_ACCOUNTING_ACCOUNTS, GET_MERCHANT_ACCOUNTING_VAT_ACCOUNTS, GET_MERCHANT_ACCOUNTING_JOURNALS, GET_MERCHANT_ACCOUNTING_DEPARTMENTS, SAVE_MERCHANT_ACCOUNTING_SETUP, GET_INTEGRATION_LINK } from 'src/queries/accounting';
import { GET_SOLUTIONS } from 'src/queries/solution';
import { GET_ACQUIRING_PROVIDERS } from 'src/queries/provider';
import { TOGGLE_STORE_SPECIFIC_BOOKKEEPING } from 'src/queries/accounting';
// hooks
import { useQuery } from 'src/hooks/apollo';
// ----------------------------------------------------------------------

import { CircularProgress, AvatarGroup, Avatar } from '@mui/material';
import img from 'src/utils/img';
import useConfirmDialog from 'src/hooks/useConfirmDialog';
import AllSales from 'src/components/sales/all';
import Dialog from 'src/components/custom-dialog';
import TransactionHistoryDialog from 'src/components/transactions/history-dialog';
import BookkeepingConfigForm from 'src/components/bookkeeping-config-form';
import AutomaticBookkeepingSwitch from 'src/components/automatic-bookkeeping-switch';

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

const storeTypes = {
  'webshop': 'Webshop',
  'physical': 'Fysisk butik',
  'restaurant': 'Restaurant',
}

const storeIcons = {
  'webshop': 'eva:shopping-cart-fill',
  'physical': 'eva:pin-fill',
  'restaurant': 'material-symbols:restaurant-rounded',
}

const GeneralTab = () => {
  
  const router = useRouter()
  const store = useQuery(GET_STORE_GENERAL_DATA, { variables: { storeId: parseInt(router.query.id, 10) } })
  const { enqueueSnackbar } = useSnackbar();
  const storePageTabActionButtonRef = useRef(null)

  const { user } = useAuthContext();

  const methods = useForm();

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(error);
    }
  };

  const [ deleteStore, ConfirmDeleteStoreDialog ] = useConfirmDialog({
    onConfirm: () => null,
  })

  const TabActionPopover = usePopover()

  useEffect(() => {
    if (store.data) {
      methods.reset(store.data)
    }
  }, [ store.data, store.loading ])

  useEffect(() => {
    storePageTabActionButtonRef.current = document.getElementById('storePageTabActionButton')
  }, [])

  return store.loading ? <CenteredLoadingIndicator /> : (
    <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>

      {storePageTabActionButtonRef.current && ReactDOM.createPortal((
        <TabActionPopover.Component control={<CustomButton icon={<Iconify icon="fluent:chevron-down-20-filled" />}>Handling</CustomButton>}>
          <MenuItem onClick={deleteStore}>Slet</MenuItem>
        </TabActionPopover.Component>
      ), storePageTabActionButtonRef.current)}

      <ConfirmDeleteStoreDialog
        title={`Slet ${store?.data?.name}?`}
        confirmLabel="Slet"
        confirmColor="error"
      >
        <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette dit salgssted {store?.data?.name}?</Typography>
        <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
      </ConfirmDeleteStoreDialog>
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
              <RHFTextField name="name" label="Salgsstedets navn" />

              <RHFTextField name="email" label="Email Address" />

              <RHFTextField name="phone" label="Telefon" />

              <RHFTextField name="address.line_1" label="Adresse linje 1" />

              <RHFSelect native name="address.country" label="Land" placeholder="Land">
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="address.line_2" label="Adresse linje 2" />

              <RHFTextField name="address.city" label="By" />

              <RHFTextField name="address.zip" label="Postnummer" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="notes" multiline rows={4} label="Noter" />

              <LoadingButton type="submit" variant="contained" loading={false}>
                Gem
              </LoadingButton>
            </Stack>
          </Card>
        </FormProvider>
      </Grid>
    </Grid>
  )
}

const NewSolutionFormDialog = ({ onSave }) => {
  const router = useRouter()
  const type= router.hashParams.get('new_solution')
  const open = Boolean(type)
  const handleClose = () => router.updateHashParams({ new_solution: null })
  return (
    <Dialog
      open={Boolean(type)}
      maxWidth="lg"
      onClose={handleClose}
      title={`Opret ny ${type} betalingsløsning`}
      actions={
        <>
          <Button onClick={onSave} variant="contained">Opret</Button>
          <Button onClick={handleClose} variant="contained">Luk</Button>
        </>
      }
    >
      <Typography>Her kan du oprette en ny betalingsløsning.</Typography>
    </Dialog>
  )
}

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" size={80} {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="h6"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const GatewayLoginForm = ({ authUrl, integration, integrationId, integrationLinkId, loginLabel, passwordLabel }) => {
  const router = useRouter();
  const [ working, setWorking ] = useState(false);
  const [ progress, setProgress ] = useState(0);
  const [ status, setStatus ] = useState(null);
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);
  const methods = useForm();
  const onIntegrationCompleted = () => {
    window.location.reload();
  }
  const onSubmit = async (data) => {
    const res = await axios.post('/api/authorize', {
      login: data._login,
      password: data._pass,
      authUrl,
      integration,
      integrationId,
      integrationLinkId,
      merchantId,
    });
    if (res?.data?.guid) {
      setWorking(true);
      const events = new EventSource(`https://progress.paypilot.dk/${res.data.guid}`);
      events.addEventListener(res.data.guid, async (e) => {
        const data = JSON.parse(e.data);
        setProgress(data.progress);
        setStatus(data.status);
        if (data.progress === 100) {
          events.close();
          onIntegrationCompleted();
        }
      });
    }
  };
  const progressIndicator = working ? (
    <Stack alignItems="center" justifyContent="center" direction="column" spacing={1}>
      <CircularProgressWithLabel value={progress} />
      <Typography>{status}...</Typography>
    </Stack>
  ) : null;
  return progressIndicator || (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack sx={{ pt: 1 }} direction="column" spacing={2}>
        <RHFTextField name="_login" label={loginLabel} required autoFocus autoComplete="off" />
        <RHFTextField name="_pass" label={passwordLabel} type="password" required autoComplete="new-password" />
        <Typography sx={{ fontSize: '11px' }}>Ved at udfylde og indsende denne formular accepterer du vores <a href="javascript:void(0);">betingelser</a>.</Typography>
        <LoadingButton type="submit" variant="contained" loading={false}>Færdiggør integration</LoadingButton>
      </Stack>
    </FormProvider>
  );
}

const SolutionsTab = () => {
  const [ mounted, setMounted] = useState(false)
  const router = useRouter()
  const storePageTabActionButtonRef = useRef(null)
  const TabActionPopover = usePopover()
  const { session } = useAuthContext()
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);
  const stores = session?.user?.merchants?.[merchantId].stores ?? [];
  const solutions = useQuery(GET_SOLUTIONS, { variables: { storeId: parseInt(router.query.id, 10) } })
  const [ deleteSolution, ConfirmDeleteSolutionDialog ] = useConfirmDialog({
    onConfirm: () => null,
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
    <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
      {mounted && ReactDOM.createPortal((
        <TabActionPopover.Component control={<CustomButton icon={<Iconify icon="fluent:chevron-down-20-filled" />}>Opret ny løsning</CustomButton>}>
          <MenuItem onClick={() => createNewSolution('POS')}>POS</MenuItem>
          <MenuItem onClick={() => createNewSolution('ECOM')}>ECOM</MenuItem>
          <MenuItem onClick={() => createNewSolution('MOTO')}>MOTO</MenuItem>
          <MenuItem onClick={() => createNewSolution('CAT')}>CAT</MenuItem>
        </TabActionPopover.Component>
      ), storePageTabActionButtonRef.current)}

      <ConfirmDeleteSolutionDialog
        title="Slet betalingsløsning?"
        confirmLabel="Slet"
        confirmColor="error"
      >
        <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette din betalingsløsning?</Typography>
        <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
      </ConfirmDeleteSolutionDialog>

      <NewSolutionFormDialog onSave={() => router.updateHashParams({ new_solution: null })} />
      
      {!solutions.data ? <CenteredLoadingIndicator /> : (solutions.data.map((solution, index) => {
        solution.completionPercent = 100;
        const gatewayUnfinished = solution.type === 'ECOM' && !solution.gateway_service_agreements[0].gateway_service;
        const cardContent = (
          <>
            <CardHeader
              avatar={
                <AvatarGroup max={4}>
                  {solution?.acquiring_service_agreements?.map(({ acquiring_service }) => (
                      <Avatar
                        alt={(acquiring_service?.provider ?? acquiring_service?.partner)?.name}
                        src={img((acquiring_service?.provider ?? acquiring_service?.partner)?.logo?.url)}
                        sx={{
                          backgroundColor: 'background.paper',
                          '& .MuiAvatar-img': {
                            objectFit: 'contain',
                          },
                        }}
                      />
                    ))}
                  {solution?.gateway_service_agreements?.map(({ gateway_service, integration_link }) => (
                      <Avatar
                        alt={(gateway_service?.provider ?? gateway_service?.partner ?? integration_link?.integration)?.name}
                        src={img((gateway_service?.provider ?? gateway_service?.partner ?? integration_link?.integration)?.logo?.url)}
                        sx={{
                          backgroundColor: 'background.paper',
                          '& .MuiAvatar-img': {
                            objectFit: 'contain',
                          },
                        }}
                      />
                    ))}
                  {solution?.terminal_service_agreements?.map(({ terminal_service }) => (
                      <Avatar
                        alt={(terminal_service?.provider ?? terminal_service?.partner)?.name}
                        src={img((terminal_service?.provider ?? terminal_service?.partner)?.logo?.url)}
                        sx={{
                          backgroundColor: 'background.paper',
                          '& .MuiAvatar-img': {
                            objectFit: 'contain',
                          },
                        }}
                      />
                    ))}
                </AvatarGroup>
              }
              title={solution.gateway_service_agreements[0].integration_link.integration.name}
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
              {gatewayUnfinished && (
                <GatewayLoginForm
                  integration={solution.gateway_service_agreements[0].integration_link.integration.slug}
                  integrationId={solution.gateway_service_agreements[0].integration_link.integration.id}
                  integrationLinkId={solution.gateway_service_agreements[0].integration_link.id}
                  loginLabel={solution.gateway_service_agreements[0].integration_link.integration.scraper_auth_config.auth_login_field_label}
                  passwordLabel={solution.gateway_service_agreements[0].integration_link.integration.scraper_auth_config.auth_password_field_label}
                  authUrl={solution.gateway_service_agreements[0].integration_link.integration.auth_url}
                />
              )}
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
          </>
        );
        return (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={gatewayUnfinished ? { boxShadow: 24 } : {}}>
              {gatewayUnfinished ? cardContent : (
                <CardActionArea onClick={(e) => {
                  if ((e?.target?.className?.indexOf('MuiModal') ?? -1) !== -1) return true
                  router.push(PATH_APP.solutions.view(solution.id))
                }}>
                  {cardContent}
                </CardActionArea>
              )}
            </Card>
          </Grid>
        )
      }))}
    </Grid>
  )
}
import _mock from 'src/_mock';
import CenteredLoadingIndicator from '@/components/centered-loading-indicator';

const SalesTab = () => {
  const router = useRouter()
  const storeId = parseInt(router.query.id, 10)
  return (
    <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
      <TransactionHistoryDialog />
      <Grid item xs={12} sx={{ height: '60vh' }}>
        <AllSales storeId={storeId} rowActions={[
          { label: 'Vis transaktionshistorik', onClick: (params) => router.updateHashParams({
            transaction_history: params.id,
          }) },
          { label: 'Vis transaktioner', onClick: (params) => router.push(`${PATH_APP.payments.sales.view(params.id)}#tab=transactions`) },
          { label: 'Vis ordredetaljer', onClick: (params) => router.push(PATH_APP.payments.sales.view(params.id)) },
        ]} />
      </Grid>
    </Grid>
  )
}

const NewIntegrationDialog = ({ open, onClose, onSave }) => {
  const router = useRouter()
  const integrations = useQuery(GET_AVAILABLE_INTEGRATIONS, { variables: { storeId: parseInt(router.query.id, 10) } })
  return (
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={onClose}
      title="Opret ny integration"
      actions={<Button onClick={onClose} variant="contained">Luk</Button>}
    >
      <Typography>Vælg en integration til dit salgssted fra listen.</Typography>
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
    </Dialog>
  )
}
const IntegrationsTab = () => {
  const [ mounted, setMounted] = useState(false)
  const router = useRouter()
  const storePageTabActionButtonRef = useRef(null)
  const TabActionPopover = usePopover()
  const { session } = useAuthContext()
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);
  const stores = session?.user?.merchants?.[merchantId].stores ?? [];
  const integrations = useQuery(GET_STORE_INTEGRATIONS, { variables: { storeId: parseInt(router.query.id, 10) } })
  const [ deleteIntegration, ConfirmDeleteIntegrationDialog ] = useConfirmDialog({
    onConfirm: () => null,
  })
  useEffect(() => {
    if (!mounted) {
      storePageTabActionButtonRef.current = document.getElementById('storePageTabActionButton')
      setMounted(true)
    }
  }, [])
  return integrations.loading ? <CenteredLoadingIndicator /> : (
    <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
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
    </Grid>
  )
}

const StoreSpecificBookkeepingSwitch = ({ storeId, merchantId, callback }) => {
    const [ toggleStoreSpecificBookkeeping, storeSpecificBookkeping ] = useMutation(TOGGLE_STORE_SPECIFIC_BOOKKEEPING);
    const isStoreSpecificBookkeepingActive = !!useWatch({ name: 'store_specific_bookkeeping' });
    const isAutomaticBookkeepingActive = !!useWatch({ name: 'automatic_bookkeeping' });
    const router = useRouter();  
    const formState = useFormState();
    const [ saving, setSaving ] = useState(false);
    useEffect(() => {
      const save = async () => {
        if (formState?.touchedFields?.store_specific_bookkeeping) {
          setSaving(true);
          await toggleStoreSpecificBookkeeping({
            variables: {
              storeId,
              merchantId,
              enabled: isStoreSpecificBookkeepingActive,
            }
          });
          setSaving(false);
          if (typeof callback === 'function') callback();
        }
      };
      save();
    }, [ isStoreSpecificBookkeepingActive, formState?.touchedFields?.store_specific_bookkeeping ]);
    return !isAutomaticBookkeepingActive ? null : (saving ? (
      <Stack direction="row" alignItems="center" spacing={1.37} sx={{ height: '38px', pl: 2 }}>
        <CircularProgress sx={{ width: '20px !important', height: '20px !important' }} />
        <Typography variant="body2">Aktiver salgsstedspecifik bogføring</Typography>
      </Stack>
    ) : (
      <RHFSwitch name="store_specific_bookkeeping" label="Aktiver salgsstedspecifik bogføring" />
    ));
  }

const BookkeepingTab = () => {

  const router = useRouter();

  const storeId = parseInt(router.query.id, 10);
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);

  const integrationLinkQuery = useQuery(GET_INTEGRATION_LINK, {
    variables: {
      type: 'bookkeeping',
      storeId,
      getClosest: true,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });
  const currentSetup = useMemo(() => {
    if (integrationLinkQuery?.data?.config) {
      integrationLinkQuery.data.config = {
        setup: JSON.parse(integrationLinkQuery?.data?.config)?.setup,
      };
    }
    return integrationLinkQuery.data;
  }, [ integrationLinkQuery?.data ]);

  const journalsQuery = useQuery(GET_MERCHANT_ACCOUNTING_JOURNALS, {
    variables: {
      storeId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  const accountsQuery = useQuery(GET_MERCHANT_ACCOUNTING_ACCOUNTS, {
    variables: {
      storeId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  const vatAccountsQuery = useQuery(GET_MERCHANT_ACCOUNTING_VAT_ACCOUNTS, {
    variables: {
      storeId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  const departmentsQuery = useQuery(GET_MERCHANT_ACCOUNTING_DEPARTMENTS, {
    variables: {
      storeId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  const acquiringProvidersQuery = useQuery(GET_ACQUIRING_PROVIDERS, {
    variables: {
      storeId,
      merchantId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });  

  const [ saveMerchantAccountingSetup, merchantAccountingSetupMutation ] = useMutation(SAVE_MERCHANT_ACCOUNTING_SETUP)

  const methods = useForm()
  useEffect(() => {
    if (currentSetup) {
      methods.reset({
        ...currentSetup.config.setup,
        automatic_bookkeeping: currentSetup.active,
        store_specific_bookkeeping: currentSetup.config.setup && !!currentSetup.storeId,
      });
    }
  }, [currentSetup]);
  const onSubmit = (data) => {
    delete data.automatic_bookkeeping;
    delete data.store_specific_bookkeeping;
    saveMerchantAccountingSetup({
      variables: {
        storeId,
        setup: JSON.stringify(data),
      },
    });
  };
  
  if (integrationLinkQuery.loading || merchantAccountingSetupMutation.loading || departmentsQuery.loading || journalsQuery.loading || accountsQuery.loading || vatAccountsQuery.loading) return <CenteredLoadingIndicator />

  if (!journalsQuery?.data?.length || !accountsQuery?.data?.length || !vatAccountsQuery?.data?.length) {
    return <Typography variant="body2">Kunne ikke få fat i dine bogføringsdata. Har du sat en bogføringsintegration op endnu?</Typography>
  }

  const journalOptions = journalsQuery?.data?.map((journal) => {
    return { label: journal.name, value: journal.id }
  })

  const accountOptions = accountsQuery?.data?.map((account) => {
    return account.parent ? { label: `${account.number} - ${account.name}`, value: account.number, groupBy: `${account.parent.number} - ${account.parent.name}` } : null
  }).filter((account) => account)

  const vatAccountOptions = vatAccountsQuery?.data?.map((vatAccount) => {
    return { label: `${vatAccount.vatCode} - ${vatAccount.name}`, value: vatAccount.vatCode }
  })

  const departmentOptions = [{ label: 'Ingen', value: null }].concat(departmentsQuery?.data?.map((department) => {
    return { label: department.name, value: department.id };
  }))
  
  return currentSetup?.disabledByMerchant ? (
    <Typography variant="body1">Bogføring er slået fra på virksomheden, som dette salgssted er en del af.<br />Ønsker du bogføring af bevægelserne på dette salgssted, skal du først og fremmest slå bogføring til, på <Link href={`/bookkeeping/#merchant=${merchantId}`}>den relevante virksomhed</Link>.</Typography>
  ) : (
          <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <AutomaticBookkeepingSwitch storeId={storeId} />
            <StoreSpecificBookkeepingSwitch storeId={storeId} merchantId={merchantId} callback={() => integrationLinkQuery.refetch()} />
          </Stack>
        </Grid>
      </Grid>
      {(currentSetup?.storeId && currentSetup?.config?.setup && !currentSetup?.disabledByMerchant) && <BookkeepingConfigForm
        accountOptions={accountOptions}
        journalOptions={journalOptions}
        vatAccountOptions={vatAccountOptions}
        departmentOptions={departmentOptions}
        acquiringProviders={acquiringProvidersQuery?.data ?? []}
      />}
    </FormProvider>
  )
}

const TabContent = ({ component }: { component: React.ReactElement }) => {
  const Component = component;
  return <Component />;
}

const TABS = {
  general: {
    label: 'General',
    icon: <Iconify icon="eva:edit-fill" sx={{ mr: 1 }} />,
    component: React.memo(GeneralTab),
  },
  solutions: {
    label: 'Løsninger',
    icon: <Iconify icon="eva:shopping-cart-fill" sx={{ mr: 1 }} />,
    component: React.memo(SolutionsTab),
  },
  sales: {
    label: 'Salg',
    icon: <Iconify icon="material-symbols:receipt" sx={{ mr: 1 }} />,
    component: React.memo(SalesTab),
  },
  integrations: {
    label: 'Integrationer',
    icon: <Iconify icon="bi:lightning-charge-fill" sx={{ mr: 1, rotate: '-6deg' }} />,
    component: React.memo(IntegrationsTab),
  },
  bookkeeping: {
    label: 'Bogføring',
    icon: <Iconify icon="ri:book-fill" sx={{ mr: 1 }} />,
    component: React.memo(BookkeepingTab),
  }
}

export default function GeneralAppPage() {
  
  const router = useRouter();
  const id = router.query.id;
  const selectedTab = router.hashParams.get('tab') ?? 'general';
  const { user } = useAuthContext();
  const { session } = useAuthContext();
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);
  const stores = session?.user?.merchants?.[merchantId].stores ?? [];
  const store = stores?.[id];
  
  const [ createNewStoreType, setCreateNewStoreType ] = useState(false);

  const theme = useTheme();

  const { themeStretch } = useSettingsContext();
  
  useIsomorphicLayoutEffect(() => {
    if (!store?.id) {
      router.replace(`/stores#merchant=${router.hashParams.get('merchant')}`);
    }
  }, [ store ])
  
  return (
    <>

      <Head>
        <title>PayPilot | Salgssted</title>
      </Head>

      {store?.id && (
        <TabContext value={selectedTab}>
          <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>
            <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>

              <Grid item xs={12}>
                <Typography variant="h4">
                  Salgssteder: {store.name}
                </Typography>
                <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
                  Administrer dit salgssted forneden
                </Typography>
              </Grid>
            </Grid>

            <Grid container xs={12} sx={{ pt: 1.75 }}>

              <Grid item xs={12} md={8} display="flex" alignItems="center" spacing={1}>
                <TabList onChange={(e, value) => router.updateHashParams({ tab: value })}>
                    {Object.keys(TABS).map((tabId) => <Tab key={tabId} label={<>{TABS[tabId].icon} {TABS[tabId].label}</>} value={tabId} />)}
                </TabList>
              </Grid>

              <Grid key={selectedTab} item xs={12} md={4} display="flex" justifyContent="flex-end" alignItems="center" spacing={1} id="storePageTabActionButton"></Grid>
            </Grid>

          </Container>
          
          {Object.keys(TABS).map((tabId) => (
            <TabPanel key={tabId} value={tabId} sx={{ pt: 3, position: 'relative' }} classes="MuiContainer-root">
              <TabContent component={TABS[tabId].component} />
            </TabPanel>
          ))}

        </TabContext>
      )}

    </>
  );
}
