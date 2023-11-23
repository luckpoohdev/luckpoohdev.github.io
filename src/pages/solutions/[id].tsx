// react
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { useState, useEffect, useRef, useMemo } from 'react'
// hook form
import { useWatch } from 'react-hook-form'
// apollo
import { useMutation } from '@apollo/client';
// Yup
import * as Yup from 'yup';
// next
import Head from 'next/head';
import Link from 'next/link';
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
  Switch,
  FormGroup,
  FormControlLabel,
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

import getIntegrationConnectionUrl from 'src/utils/getIntegrationConnectionUrl';
import { useSelector } from 'src/redux/store';
import usePopover from 'src/hooks/usePopover';
import CustomButton from 'src/components/custom-button';
import MenuItem from '@mui/material/MenuItem';
import MoreActionsButton from 'src/components/more-actions-button';
import Iconify from 'src/components/iconify/Iconify';
import CenteredLoadingIndicator from '@/components/centered-loading-indicator';

import { fPercent } from 'src/utils/formatNumber';
import { PATH_APP } from 'src/routes/paths';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import FormProvider from 'src/components/hook-form/FormProvider';
import { LoadingButton } from '@mui/lab';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import useRouter from 'src/hooks/useRouter';
import { countries } from 'src/assets/data';
import LatestSalesTable from 'src/components/sales/latest';
// queries
import { GET_SOLUTION_NAME, GET_SOLUTION_GENERAL_DATA, GET_AVAILABLE_INTEGRATIONS, GET_SOLUTION_INTEGRATIONS } from 'src/queries/solution';
import { GET_ACQUIRING_SERVICE, GET_GATEWAY_SERVICE, GET_TERMINAL_SERVICE } from 'src/queries/service';
import {
  GET_MERCHANT_ACCOUNTING_ACCOUNTS, GET_MERCHANT_ACCOUNTING_VAT_ACCOUNTS, GET_MERCHANT_ACCOUNTING_JOURNALS, GET_MERCHANT_ACCOUNTING_DEPARTMENTS,
  SAVE_MERCHANT_ACCOUNTING_SETUP, GET_INTEGRATION_LINK, TOGGLE_SOLUTION_SPECIFIC_BOOKKEEPING,
} from 'src/queries/accounting';
import { GET_ACQUIRING_PROVIDERS } from 'src/queries/provider';
// hooks
import { useQuery } from 'src/hooks/apollo';
// ----------------------------------------------------------------------

import { CircularProgress, AvatarGroup, Avatar } from '@mui/material';
import img from 'src/utils/img';
import useConfirmDialog from 'src/hooks/useConfirmDialog';
import AllSales from 'src/components/sales/all';
import AllTransactions from 'src/components/transactions/all';
import Dialog from 'src/components/custom-dialog';
import { AcquiringServiceCard, GatewayServiceCard } from 'src/components/service-card';
import { _userCards } from 'src/_mock/arrays';
import TransactionHistoryDialog from 'src/components/transactions/history-dialog';
import CollapsibleCard from 'src/components/collapsible-card';
import { RHFTextField, RHFAutocomplete, RHFCountrySelect, RHFSwitch, RHFRadioGroup } from 'src/components/hook-form';
import CountryFlag from 'src/components/country-flag';
import Wizard from 'src/components/wizard';
import Icon from 'src/components/Icon';
import AutomaticBookkeepingSwitch from 'src/components/automatic-bookkeeping-switch';
import BookkeepingConfigForm from 'src/components/bookkeeping-config-form';

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

const AcquiringServiceDialog = ({ open, onClose, onSave }) => {
  const router = useRouter()
  const idRef = useRef(null)
  if (!idRef.current || open) idRef.current = parseInt(router.hashParams.get('acquiring_service'), 10)
  const service = useQuery(GET_ACQUIRING_SERVICE, { variables: { id: idRef.current } })
  const name = (service.data?.provider ?? service.data?.partner)?.name
  return (
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={onClose}
      title={name}
      actions={<Button onClick={onClose} variant="contained">Luk</Button>}
    >
      {service.loading ? <CircularProgress /> : (service.data && (
        <>
          <Typography>Indløsningsaftale</Typography>
          <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 3.5 }}>
            <Grid item xs={12} sx={{ pt: 0 }}>Her kommer data om den specfikke indløsningsaftale.</Grid>
          </Grid>
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
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={onClose}
      title={name}
      actions={<Button onClick={onClose} variant="contained">Luk</Button>}
    >
      {service.loading ? <CircularProgress /> : service.data && (
        <>
          <Typography>Gateway aftale</Typography>
          <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 3.5 }}>
            <Grid item xs={12} sx={{ pt: 0 }}>Her kommer data om den specfikke gateway aftale.</Grid>
          </Grid>
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
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={onClose}
      title={name}
      actions={<Button onClick={onClose} variant="contained">Luk</Button>}
    >
      {service.loading ? <CircularProgress /> : service.data && (
        <>
          <Typography>Terminalaftale</Typography>
          <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 3.5 }}>
            <Grid item xs={12} sx={{ pt: 0 }}>Her kommer data om den specfikke terminalaftale.</Grid>
          </Grid>
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

  const tenderSolution = () => router.updateHashParams({ action: 'tender_solution' })

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
    <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>

      {storePageTabActionButtonRef.current && ReactDOM.createPortal((
        <TabActionPopover.Component control={<CustomButton icon={<Iconify icon="fluent:chevron-down-20-filled" />}>Handling</CustomButton>}>
          <MenuItem onClick={tenderSolution}>Opret udbud</MenuItem>
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
    </Grid>
  )
}

import _mock from 'src/_mock';
import { randomInArray } from 'src/_mock';

const _dataGrid = [...Array(36)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  email: _mock.email(index),
  lastLogin: _mock.time(index),
  performance: _mock.number.percent(index),
  rating: _mock.number.rating(index),
  status: randomInArray(['online', 'away', 'busy']),
  isAdmin: _mock.boolean(index),
  lastName: _mock.name.lastName(index),
  firstName: _mock.name.firstName(index),
  age: _mock.number.age(index),
}));


const SalesTab = () => {
  const router = useRouter()
  const solutionId = parseInt(router.query.id, 10)
  return (
    <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
      <TransactionHistoryDialog />
      <Grid item xs={12} sx={{ height: '60vh' }}>
        <AllSales solutionId={solutionId} rowActions={[
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

const TransactionsTab = () => {
  const router = useRouter()
  const solutionId = parseInt(router.query.id, 10)
  return (
      <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
        <Grid item xs={12} sx={{ height: '60vh' }}>
          <AllTransactions solutionId={solutionId} />
        </Grid>
      </Grid>
  )
}

const NewIntegrationDialog = ({ onIntegrationClick, open, onClose, onSave }) => {
  const router = useRouter()
  const integrations = useQuery(GET_AVAILABLE_INTEGRATIONS, { variables: { solutionId: parseInt(router.query.id, 10) } })
  return (
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={onClose}
      title="Opret ny integration"
      actions={<Button onClick={onClose} variant="contained">Luk</Button>}
    >
      <Typography>
        Vælg en integration til din betalingsløsning fra listen.
      </Typography>
      {!integrations.data ? <CircularProgress /> : (
        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 3.5 }}>
          {integrations.data.map((integration) => {
            return (
              <Grid item xs={12} md={4} sx={{ pt: 0 }}>
                <Card>
                  <CardActionArea onClick={(e) => {
                    if ((e?.target?.className?.indexOf('MuiModal') ?? -1) !== -1) return true
                    onIntegrationClick(integration.id);
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
  const [ mounted, setMounted] = useState(false);
  const router = useRouter();
  const storePageTabActionButtonRef = useRef(null);
  const TabActionPopover = usePopover();
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);
  const solutionId = parseInt(router.query.id, 10);
  const { session } = useAuthContext();
  const stores = session?.user?.merchants?.[merchantId].stores ?? [];
  const integrations = useQuery(GET_SOLUTION_INTEGRATIONS, { variables: { solutionId } })
  const [ deleteIntegration, ConfirmDeleteIntegrationDialog ] = useConfirmDialog({
    onConfirm: () => null,
  })
  
  const onIntegrationClick = async (integrationId) => {
    window.location.href = await getIntegrationConnectionUrl({
      solution: solutionId,
      merchant: merchantId,
      integration: integrationId,
    });
  }
  useEffect(() => {
    if (!mounted) {
      storePageTabActionButtonRef.current = document.getElementById('storePageTabActionButton')
      setMounted(true)
    }
  }, [])
  return (
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

      <NewIntegrationDialog onIntegrationClick={onIntegrationClick} open={router.hashParams.get('new_integration')} onClose={() => router.updateHashParams({ new_integration: null })} onSave={() => router.updateHashParams({ new_integration: null })} />
    
      {!integrations.data ? <CenteredLoadingIndicator /> : (
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

const OssTaxCountries = ({ accountOptions, vatAccountOptions, departmentOptions }) => {
  const ossTaxCountries = useWatch({ name: 'selected_oss_tax_countries' }) ?? []
  return (
    <>
      <Grid item xs={12} sx={{ mx: 3, mt: 3 }}>
        <Typography variant="subtitle1">Opsæt specifik kontoplan for særskilte lande (OSS Moms)</Typography>
        <RHFCountrySelect
          name="selected_oss_tax_countries"
          label="Valgte lande"
          placeholder="Tilføj land..."
          multiple
          sx={{ mt: 3 }}
        />
      </Grid>
      {ossTaxCountries.sort().map((ossTaxCountryCode, key) => {
        const prefix = `oss_tax_countries.${ossTaxCountryCode}.`
        return (
          <Grid item xs={12} key={key}>
            <CollapsibleCard defaultCollapsed={true} unmountOnExit={false}>
              <CardHeader title={
                <Stack direction="row" spacing={2} alignItems="center">
                  <CountryFlag code={ossTaxCountryCode} />
                  <Typography variant="subtitle1">Kontoplan for salg til {ossTaxCountryCode}</Typography>
                </Stack>
              } />
              <CardContent>
                <Grid container rowSpacing={3} columnSpacing={2} sx={{ pt: 1 }}>
                  <Grid item xs={12} md={4}><RHFAutocomplete name={`${prefix}department`} label="Afdeling" options={departmentOptions} /></Grid>
                  <Grid item xs={12} md={4}><RHFAutocomplete name={`${prefix}vat_code_sales`} label="Momskode for salg med moms" required options={vatAccountOptions} /></Grid>
                  <Grid item xs={12} md={4}><RHFAutocomplete name={`${prefix}no_vat_code_sales`} label="Momskode for salg uden moms" required options={vatAccountOptions} /></Grid>
                  <Grid item xs={12} md={6}><Typography variant="subtitle1">Kontoplan for salg</Typography></Grid>
                  <Grid item xs={12} md={6}><Typography variant="subtitle1">Kontoplan for refunderinger</Typography></Grid>
                  <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}vat_product_sale_account`} label="Salg af varer med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                  <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}vat_product_refund_account`} label="Refundering af varer med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                  <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}no_vat_product_sale_account`} label="Salg af varer uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                  <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}no_vat_product_sale_refund`} label="Refundering af varer uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                  <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}vat_service_sale_account`} label="Salg af ydelser med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                  <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}vat_service_refund_account`} label="Refundering af ydelser med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                  <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}no_vat_service_sale_account`} label="Salg af ydelser uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                  <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}no_vat_service_refund_account`} label="Refundering af ydelser uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                  <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}vat_shipping_sale_account`} label="Salg af fragt med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                  <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}vat_shipping_refund_account`} label="Refundering af fragt med moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                  <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}no_vat_shipping_sale_account`} label="Salg af fragt uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                  <Grid item xs={12} md={6}><RHFAutocomplete name={`${prefix}no_vat_shipping_refund_account`} label="Refundering af fragt uden moms" required options={accountOptions} groupBy={(option) => option.groupBy} /></Grid>
                  <Grid item xs={12} md={12}>
                      <Button type="submit" variant="contained" fullWidth>Gem indstillinger</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </CollapsibleCard>
          </Grid>
        )
      })}
    </>
  )
}

const SolutionSpecificBookkeepingSwitch = ({ solutionId, merchantId, callback }) => {
  const [ toggleSolutionSpecificBookkeeping, solutionSpecificBookkeping ] = useMutation(TOGGLE_SOLUTION_SPECIFIC_BOOKKEEPING);
  const isSolutionSpecificBookkeepingActive = !!useWatch({ name: 'solution_specific_bookkeeping' });
  const isAutomaticBookkeepingActive = !!useWatch({ name: 'automatic_bookkeeping' });
  const formState = useFormState();
  const [ saving, setSaving ] = useState(false);
  useEffect(() => {
    const save = async () => {
      if (formState?.touchedFields?.solution_specific_bookkeeping) {
        setSaving(true);
        await toggleSolutionSpecificBookkeeping({
          variables: {
            solutionId,
            merchantId,
            enabled: isSolutionSpecificBookkeepingActive,
          }
        });
        setSaving(false);
        if (typeof callback === 'function') callback();
      }
    };
    save();
  }, [ isSolutionSpecificBookkeepingActive, formState?.touchedFields?.solution_specific_bookkeeping ]);
  return !isAutomaticBookkeepingActive ? null : (saving ? (
    <Stack direction="row" alignItems="center" spacing={1.37} sx={{ height: '38px', pl: 2 }}>
      <CircularProgress sx={{ width: '20px !important', height: '20px !important' }} />
      <Typography variant="body2">Aktiver løsningsspecifik bogføring</Typography>
    </Stack>
  ) : (
    <RHFSwitch name="solution_specific_bookkeeping" label="Aktiver løsningsspecifik bogføring" />
  ));
}

const BookkeepingTab = () => {

  const router = useRouter();

  const solutionId = parseInt(router.query.id, 10);
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);

  const integrationLinkQuery = useQuery(GET_INTEGRATION_LINK, {
    variables: {
      type: 'bookkeeping',
      solutionId,
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
      solutionId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  const accountsQuery = useQuery(GET_MERCHANT_ACCOUNTING_ACCOUNTS, {
    variables: {
      solutionId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  const vatAccountsQuery = useQuery(GET_MERCHANT_ACCOUNTING_VAT_ACCOUNTS, {
    variables: {
      solutionId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  const departmentsQuery = useQuery(GET_MERCHANT_ACCOUNTING_DEPARTMENTS, {
    variables: {
      solutionId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  const acquiringProvidersQuery = useQuery(GET_ACQUIRING_PROVIDERS, {
    variables: {
      solutionId,
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
        solution_specific_bookkeeping: currentSetup.config.setup && !!currentSetup.solutionId,
      });
    }
  }, [currentSetup]);
  
  const onSubmit = (data) => {
    delete data.automatic_bookkeeping;
    delete data.solution_specific_bookkeeping;
    saveMerchantAccountingSetup({
      variables: {
        solutionId,
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

  return currentSetup?.disabledByStore || currentSetup?.disabledByMerchant ? (
    <Typography variant="body1">Bogføring er slået fra på {currentSetup?.disabledByStore ? 'salgsstedet' : (currentSetup?.disabledByMerchant ? 'virksomheden' : '')}, som denne løsning er en del af.<br />Ønsker du bogføring af bevægelserne på denne løsning, skal du først og fremmest slå bogføring til, på <Link href={currentSetup?.disabledByStore ? `/stores/${currentSetup.storeId}#merchant=${merchantId}&tab=bookkeeping` : (currentSetup?.disabledByMerchant ? `/bookkeeping/#merchant=${merchantId}` : '')}>{currentSetup?.disabledByStore ? 'det relevante salgssted' : (currentSetup?.disabledByMerchant ? 'den relevante virksomhed' : '')}</Link>.</Typography>
  ) : (
          <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <AutomaticBookkeepingSwitch solutionId={solutionId} />
            <SolutionSpecificBookkeepingSwitch solutionId={solutionId} merchantId={merchantId} callback={() => integrationLinkQuery.refetch()} />
          </Stack>
        </Grid>
      </Grid>
      {(currentSetup?.solutionId && currentSetup?.config?.setup && !currentSetup?.disabledByStore && !currentSetup?.disabledByMerchant) && <BookkeepingConfigForm
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
  const Component = component
  return <Component />
}

const TABS = {
  general: {
    label: 'Generelt',
    icon: <Iconify icon="eva:edit-fill" sx={{ mr: 1 }} />,
    component: React.memo(GeneralTab),
  },
  sales: {
    label: 'Salg',
    icon: <Iconify icon="material-symbols:receipt" sx={{ mr: 1 }} />,
    component: React.memo(SalesTab),
  },
  transactions: {
    label: 'Transaktioner',
    icon: <Iconify icon="material-symbols:receipt" sx={{ mr: 1 }} />,
    component: React.memo(TransactionsTab),
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
  },
}

const CreateNewServiceDialogForm = ({ type, onClose }) => {
  return (
    <Dialog
      open={Boolean(type)}
      maxWidth="lg"
      onClose={onClose}
      title={'Tilføj service'}
      actions={<Button onClick={onClose} variant="contained">Luk</Button>}
    >
        <Typography>Tilføj service</Typography>
        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 3.5 }}>
          <Grid item xs={12} sx={{ pt: 0 }}>Formular her.</Grid>
        </Grid>
    </Dialog>
  )
}

const TenderConfirmSolution = () => {
  const router = useRouter()
  const solution = useQuery(GET_SOLUTION_GENERAL_DATA, { variables: { id: parseInt(router.query.id, 10) } })
  const totalNumServices = (
    solution?.data?.acquiring_services?.length
  ) + (
    Boolean(solution?.data?.gateway_service) ? 1 : 0
  ) + (
    Boolean(solution?.data?.gateway_service) ? 1 : 0
  )
  const NewServicePopover = usePopover()
  const handleCreateNewService = (type) => router.updateHashParams({
    add_service: type,
  })
  const handleCancelCreateNewService = () => router.updateHashParams({ add_service: null })
  return (
    <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>

      <CreateNewServiceDialogForm type={router.hashParams.get('add_service')} onClose={handleCancelCreateNewService} />

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

      {totalNumServices < 3 ? ([...Array(3-totalNumServices)].map((index) => (
        <Grid item key={index} sx={12} md={4}></Grid>
      ))) : null}

      <Grid item xs={12} md={4}>
        <NewServicePopover.Component
          control={<Button variant="soft" size="large" sx={{ textTransform: 'none' }} endIcon={<Icon name="ic_plus" />} fullWidth>Tilføj service</Button>}
          arrow="top-left"
        >
          <MenuItem onClick={() => handleCreateNewService('acquiring')}>Indløsning</MenuItem>
          <MenuItem onClick={() => handleCreateNewService('gateway')}>Gateway</MenuItem>
          <MenuItem onClick={() => handleCreateNewService('terminal')}>Terminal</MenuItem>
        </NewServicePopover.Component>
      </Grid>

    </Grid>
  )
}

const TenderSystemsIntegrations = () => {
  const router = useRouter()
  const integrations = useQuery(GET_INTEGRATIONS, { variables: { solutionId: parseInt(router.query.id, 10) } })
  const totalNumIntegrations = integrations?.data?.length
  const NewServicePopover = usePopover()
  const handleCreateNewIntegration = () => router.updateHashParams({
    new_integration: 1,
  })
  const handleCancelCreateNewIntegration = () => router.updateHashParams({ new_integration: null })
  const [ deleteIntegration, ConfirmDeleteIntegrationDialog ] = useConfirmDialog({
    onConfirm: () => null,
  })
  return (
    <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>

      <NewIntegrationDialog open={router.hashParams.get('new_integration')} onClose={handleCancelCreateNewIntegration} onSave={() => handleCancelCreateNewIntegration()} />

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

      {totalNumIntegrations < 3 ? ([...Array(3-totalNumIntegrations)].map((index) => (
        <Grid item key={index} sx={12} md={4}></Grid>
      ))) : null}

      <Grid item xs={12} md={4}>
        <Button variant="soft" size="large" sx={{ textTransform: 'none' }} endIcon={<Icon name="ic_plus" />} onClick={handleCreateNewIntegration} fullWidth>Tilføj integration</Button>
      </Grid>

      <ConfirmDeleteIntegrationDialog
        title="Slet integration?"
        confirmLabel="Slet"
        confirmColor="error"
      >
        <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette denne integration?</Typography>
        <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
      </ConfirmDeleteIntegrationDialog>

    </Grid>
  )
}

const TenderRequirements = () => {
  return <Typography variant="body2">asdasjkdjasksajd</Typography>
}

const tenderSolutionSteps = [
  { label: 'Bekræft nuværende løsning', component: <TenderConfirmSolution /> },
  { label: 'Brug af systemer og integrationer', component: <TenderSystemsIntegrations /> },
  { label: 'Fortæl os lidt mere om dit behov', component: <TenderRequirements /> },
]

const TenderCompleted = () => {
  return <div>Sådan!</div>
}

export default function GeneralAppPage() {
  
  const router = useRouter()
  const id = router.query.id
  const solutions = useQuery(GET_SOLUTION_NAME, { variables: { id: parseInt(id, 10), merchantId: parseInt(router.hashParams.get('merchant'), 10) } })
  const solution = solutions?.data?.[0]
  const selectedTab = router.hashParams.get('tab') ?? 'general'
  const { user } = useAuthContext()

  const action = router.hashParams.get('action')
  
  const [ createNewStoreType, setCreateNewStoreType ] = useState(false)

  const theme = useTheme()

  const { themeStretch } = useSettingsContext()

  useIsomorphicLayoutEffect(() => {
    if (!solutions.loading && !solution) {
      router.replace(`/stores#merchant=${router.hashParams.get('merchant')}`)
    }
  }, [ solution, solutions.loading ])

  const handleCancelTenderSolution = () => router.updateHashParams({ action: null })

  return (
    <>

      <Head>
        <title>PayPilot | Salgssted</title>
      </Head>

      {!solution ? <CenteredLoadingIndicator /> : (
        (!action && (
          <TabContext value={selectedTab}>
            <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>
              <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0 }}>
                
                <Grid item xs={12}>
                  <Typography variant="h4">
                    Betalingsløsninger: {solution?.name}
                  </Typography>
                  <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
                    Administrer din betalingsløsning forneden
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
        )) || (action === 'tender_solution' && (
          <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5, height: '100%' }}>
            <Grid item container xs={12}>
              <Grid item xs={12} md={4}>
                <Typography variant="h4">
                Betalingsløsninger: {solution?.name}: Opret udbud
                </Typography>
                <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
                Opret dit udbud forneden
                </Typography>
              </Grid>
              <Grid item container xs={12} md={8} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
                <CustomButton onClick={handleCancelTenderSolution} icon={<Iconify icon="material-symbols:close-rounded" />}>Afbryd</CustomButton>
              </Grid>
            </Grid>

            <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75, height: '100%' }}>
              <Grid item xs={12} sx={{ height: '100%' }}>
                <Wizard
                  steps={tenderSolutionSteps}
                  completedComponent={<TenderCompleted />}
                  onCancel={handleCancelTenderSolution}
                />
              </Grid>
            </Grid>

          </Container>
        ))
      )}

    </>
  );
}
