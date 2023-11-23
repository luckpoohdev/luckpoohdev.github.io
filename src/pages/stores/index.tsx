// react
import { useState, useEffect, useRef, useMemo } from 'react'
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
  CircularProgress,
  Stack,
  Box,
  InputAdornment,
} from '@mui/material';
import {
  LoadingButton,
} from '@mui/lab';
// db
import { useMutation } from '@apollo/client';
// forms
import { useForm, useWatch, useFormContext } from 'react-hook-form';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
// web
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
import Dialog from 'src/components/custom-dialog';

import useRouter from 'src/hooks/useRouter';
import useConfirmDialog from 'src/hooks/useConfirmDialog';

import useDebounce from 'src/utils/useDebounce';
import { CREATE_STORE } from 'src/queries/store';
import { GET_AVAILABLE_INTEGRATIONS } from 'src/queries/integrations';
import getIntegrationConnectionUrl from 'src/utils/getIntegrationConnectionUrl';
import { useQuery } from 'src/hooks/apollo';

// ----------------------------------------------------------------------

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

const WebsiteInput = ({ onChange, onScrapeCompleted, onScrapeFailed, sx, ...rest }) => {
  const [ busy, setBusy ] = useState(false);
  const abortControllerRef = useRef(null);
  const { setValue } = useFormContext();
  const recognizeWebshop = useDebounce(async (url) => {
    setBusy(true);
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    try {
      const res = await axios.post('/api/scrape/webshop', {
        url,
      }, {
        signal: abortControllerRef.current.signal,
      });
      if (res?.data?.error) {
        onScrapeFailed(res?.data?.error);
      } else if (typeof onScrapeCompleted === 'function') {
        onScrapeCompleted(res.data);
      }
    } catch (error) {
      console.error(error);
    }
    setBusy(false);
  }, 500);
  return (
    <RHFTextField
      name="url"
      label="Hjemmeside"
      autoComplete="off"
      onChange={(e) => {
        if (busy) {
          setBusy(false);
          abortControllerRef.current?.abort();
        }
        let value = e.nativeEvent.target.value;
        if (value.indexOf('https://') === 0 || value.indexOf('http://') === 0) {
          value = value.replace('https://', '').replace('http://', '');
          setValue('url', value);
        }
        if (value.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/)) recognizeWebshop(value);
        if (typeof onChange === 'function') onChange(value);
      }}
      sx={(theme) => {
        return { 
          mb: 2,
          ...(typeof sx === 'function' ? sx(theme) : sx),
        }
      }}
      InputProps={{
        startAdornment: <InputAdornment position="start">https://</InputAdornment>,
        endAdornment: <InputAdornment position="end">{busy && <CircularProgress size={24} />}</InputAdornment>,
      }}
      {...rest}
    />
  );
}

const NewWebshopForm = ({ submitting, setSubmitting, setCanFormSubmit, canFormSubmit }) => {  
  const router = useRouter();
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);
  const integrationsQuery = useQuery(GET_AVAILABLE_INTEGRATIONS,
    { variables: {
      merchantId,
      types: ['cms'],
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });
  const integrations = useMemo(() => {
    const ret = { data: {}, options: [] };
    for (let i = 0; i < integrationsQuery?.data?.length; i++) {
      ret.data[integrationsQuery.data[i].slug] = integrationsQuery.data[i];
      ret.options.push({ label: integrationsQuery.data[i].name, value: integrationsQuery.data[i].slug })
    }
    return ret;
  }, [ integrationsQuery?.data, integrationsQuery?.loading ]);
  console.log('integrations:', integrations);
  const methods = useForm();
  const [ showFullForm, setShowFullForm ] = useState(false);
  const {
    setValue,
    handleSubmit,
  } = methods;
  
  const createNewStore = async (data) => {
    const oauthLink = (await axios.post('/api/initiate-connection', {
      store_url: data.url,
      store_name: data.name,
      merchant_id: merchantId,
      integration_id: integrations.data[data.cms].id,
    }))?.data?.oauth_link;
    if (oauthLink) window.open(oauthLink, '_blank');
  };

  const onScrapeCompleted = (data) => {
    setShowFullForm(true);
    methods.reset({
      name: data?.name ?? null,
      cms: data?.cms ?? null,
      url: data?.url ?? null,
    });
    setCanFormSubmit(true);
  }
  const onScrapeFailed = (error) => {
    setShowFullForm(false);
    setCanFormSubmit(false);
  }
  const onUrlChange = () => {
    if (showFullForm) {
      setShowFullForm(false);
      setCanFormSubmit(false);
    }
  }
  useEffect(() => {
    if (submitting) handleSubmit(createNewStore)();
  }, [ submitting ]);
  return (
    <FormProvider methods={methods} onSubmit={(e) => {
      e.preventDefault();
      if (!canFormSubmit) {
        return false;
      }
      setSubmitting(true);
    }}>
      <WebsiteInput onScrapeCompleted={onScrapeCompleted} onScrapeFailed={onScrapeFailed} onChange={onUrlChange} autoFocus />
      {showFullForm && (
        <>
          <RHFTextField name="name" label="Navn" sx={{ mb: 2 }} autoFocus />
          <RHFAutocomplete name="cms" label="CMS" options={integrations.options} />
          <Button type="submit" sx={{ position: 'absolute', left: '-9999px', top: 0 }}></Button>
        </>
      )}
    </FormProvider>
  );
}

const FormDialog = ({ type, onClose, onSave }) => {
  let dialogContent = null;
  const router = useRouter();
  const [ submitting, setSubmitting ] = useState(false);
  const [ canFormSubmit, setCanFormSubmit ] = useState(false);
  
  switch (type) {
    case 'webshop': {
      dialogContent = <NewWebshopForm submitting={submitting} setSubmitting={setSubmitting} setCanFormSubmit={setCanFormSubmit} canFormSubmit={canFormSubmit} />
      break;
    }
  }
  return (
    <Dialog
      open={Boolean(type)}
      maxWidth="lg"
      onClose={onClose}
      title={type && `Opret ny ${storeTypes[type].toLowerCase()}`}
      actions={
        <>
          <LoadingButton type="submit" variant="contained" loading={submitting} onClick={() => setSubmitting(true)} disabled={!canFormSubmit}>Opret</LoadingButton>
          <Button onClick={onClose} variant="contained">Luk</Button>
        </>
      }
    >
      {dialogContent}
    </Dialog>
  )
}

export default function GeneralAppPage() {
  
  const router = useRouter()
  const { session } = useAuthContext()
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);
  const stores = session?.user?.merchants?.[merchantId].stores ?? [];
  const Popover = usePopover()

  const theme = useTheme()

  const { themeStretch } = useSettingsContext()

  const [ deleteStore, ConfirmDeleteStoreDialog ] = useConfirmDialog({
    onConfirm: () => null,
  })
  
  const handleCreateNewStore = (type) => {
    router.updateHashParams({
      new_store: type,
    })
  }
  
  return (
    <>

      <FormDialog type={router.hashParams.get('new_store')} onClose={() => router.updateHashParams({ new_store: null })} onSave={() => router.updateHashParams({ new_store: null })} />
      <ConfirmDeleteStoreDialog
        title="Slet salgssted?"
        confirmLabel="Slet"
        confirmColor="error"
      >
        <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette dette salgssted?</Typography>
        <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
      </ConfirmDeleteStoreDialog>

      <Head>
        <title>PayPilot | Salgssteder</title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

        <Grid item container xs={12}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4">
              Salgssteder
            </Typography>
            <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
              Se dine aktive salgssteder eller opret nye
            </Typography>
          </Grid>
          <Grid item container xs={12} md={8} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
            <Popover.Component control={<CustomButton icon={<Iconify icon="fluent:chevron-down-20-filled" />}>Opret nyt salgssted</CustomButton>}>
              {Object.keys(storeTypes).map((storeType, index) => (
                <MenuItem key={index} onClick={() => handleCreateNewStore(storeType)}>{storeTypes[storeType]}</MenuItem>
              ))}
            </Popover.Component>
          </Grid>
        </Grid>

        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75 }}>
          {Object.keys(stores).map((storeId) => {
            const store = stores[storeId]
            return (
              <Grid item xs={12} md={4}>
                <Card>
                  <CardActionArea onClick={(e) => {
                    if ((e?.target?.className?.indexOf('MuiModal') ?? -1) !== -1) return true
                    router.push(PATH_APP.stores.view(store.id))
                  }}>
                    <CardHeader
                      avatar={
                        <Iconify icon={storeIcons[store.type]} width={44} />
                      }
                      action={
                        <MoreActionsButton
                          actions={[
                            { label: 'Slet', onClick: deleteStore },
                          ]}
                        />
                      }
                    />
                    <CardContent>
                      <Typography variant="h6" color="text.primary">
                        {store.name}
                      </Typography>
                      <LinearProgress
                        value={store.completionPercent}
                        variant="determinate"
                        color={store.completionPercent < 100 ? (store.completionPercent >= 50 && store.completionPercent < 100 ? 'warning' : 'error') : 'success'}
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
                        <Box component="span" sx={{ typography: 'body2', color: 'text.disabled' }}>{fPercent(store.completionPercent)}</Box>
                        <Box component="span" sx={{ typography: 'subtitle2' }}>/ 100%</Box>
                      </Stack>
  
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </>
  );
}
