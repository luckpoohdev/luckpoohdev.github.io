// react
import { useState, useMemo } from 'react'
// networking
import axios from 'axios';
// next
import Head from 'next/head';
import getConfig from 'next/config';
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
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Stack,
  Avatar,
  AvatarGroup,
  CircularProgress,
  Box,
  Switch,
} from '@mui/material';
// db
import { useMutation } from '@apollo/client';
// forms
import { useForm } from 'react-hook-form';
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
import FormProvider, { RHFTextField } from 'src/components/hook-form';
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
import CenteredLoadingIndicator from '@/components/centered-loading-indicator';

import { fPercent } from 'src/utils/formatNumber';
import { PATH_APP } from 'src/routes/paths';
import Dialog from 'src/components/custom-dialog';

import useRouter from 'src/hooks/useRouter';
import useConfirmDialog from 'src/hooks/useConfirmDialog';
import { useQuery } from 'src/hooks/apollo';
import ucfirst from 'src/utils/ucfirst';

import { GET_INTEGRATIONS, GET_AVAILABLE_INTEGRATIONS, DELETE_INTEGRATION_LINK, UPDATE_INTEGRATION_LINK } from 'src/queries/integrations';

import img from 'src/utils/img';

import getIntegrationConnectionUrl from 'src/utils/getIntegrationConnectionUrl';

const { publicRuntimeConfig } = getConfig();


// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

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
  


const NewIntegrationDialog = ({ open, onClose, onIntegrationCompleted }) => {

  const router = useRouter();
  const newIntegration = router.hashParams.get('new_integration');
  const [ working, setWorking ] = useState(false);
  const [ progress, setProgress ] = useState(0);
  const [ status, setStatus ] = useState(null);

  const merchantId = parseInt(router.hashParams.get('merchant'), 10);

  const integrationsQuery = useQuery(GET_AVAILABLE_INTEGRATIONS,
    { variables: {
      merchantId,
      types: ['acquiring', 'bookkeeping'],
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const integrations = useMemo(() => {
    const ret = {};
    for (let i = 0; i < integrationsQuery?.data?.length; i++) {
      ret[integrationsQuery.data[i].slug] = integrationsQuery.data[i];
    }
    return ret;
  }, [ integrationsQuery?.data, integrationsQuery?.loading ]);

  const methods = useForm();

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const res = await axios.post('/api/authorize', {
      login: data._login,
      password: data._pass,
      integration: newIntegration,
      integrationId: integrations[newIntegration].id,
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
          integrationsQuery.refetch();
        }
      });
    }
  };

  let dialogContent = null;

  const progressIndicator = working ? (
    <Stack alignItems="center" justifyContent="center" direction="column" spacing={1}>
      <CircularProgressWithLabel value={progress} />
      <Typography>{status}...</Typography>
    </Stack>
  ) : null;

  const onCreateNewIntegration = (integration) => async (e) => {
    if ((e?.target?.className?.indexOf('MuiModal') ?? -1) !== -1) return true
    if (integration.scraper_auth) {
      router.updateHashParams({
        new_integration: integration.slug,
      });
    } else {
      window.location.href = await getIntegrationConnectionUrl({
        merchant: merchantId,
        integration: integration.id,
      });
    }
  }

  switch (integrationsQuery?.data?.length ? newIntegration : null) {
    case 'economic': {
      dialogContent = progressIndicator || (
        <>
          <Typography sx={{ mb: 2 }}>Log ind på {integrations[newIntegration].name} her*, så klarer vi opsætningen for dig, helt automatisk.</Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <RHFTextField name="_login" label={integrations[newIntegration].scraper_auth_config.auth_login_field_label} autoComplete="off" sx={{ mb: 2 }} />
            <RHFTextField name="_pass" type="password" label={integrations[newIntegration].scraper_auth_config.auth_password_field_label} autoComplete="new-password" />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Opsæt integration</Button>
          </FormProvider>
          <Typography sx={{ mt: 2, fontSize: 11 }} variant="body2">* Ved at logge ind med denne formular, erkender jeg som bruger, og som person, at jeg besidder den retmæssige adgang til den indtastede {integrations[newIntegration].name} konto, samt førnævnte kontos data. Endvidere bemyndiger jeg fuldt ud Advisoa ApS, samt relevante services ejet af Advisoa ApS, med de nødvendige rettigheder til at logge ind på førnævnte konto og udtrække den nødvendige data, på mine vegne, med henblik på at oprette en funktionsdygtig integration til {integrations[newIntegration].name}. Jeg giver samtidig tilladelse til at denne integration trækker på, eller manipulerer, en hvilken som helst form for data, som efter Advisoa ApS's vurdering vil berige min virksomhedsprofil på platformen PayPilot eller på anden vis vil bidrage til drift af den tilknyttede virksomhed. Jeg er indforstået med at Advisoa ApS værner om mit privatliv og at Advisoa ApS aldrig gemmer de oplysninger jeg indsender i denne formular. Jeg giver Advisoa ApS min fulde tilladelse til at opnå, opsamle, opbevare og bearbejde enhver tilgængelig form for data, der måtte ligge på den oplyste {integrations[newIntegration].name} konto. Jeg forbeholder mig mine rettigheder til at ophæve denne integration på et hvilket som helst givent tidspunkt, samt mine rettigheder til at tilbagekalde eller på anden vis anonymisere data opsamlet ved hjælp af førnævnte integration.</Typography>
        </>
      );
      break;
    }
    default: {
      dialogContent = progressIndicator || (
        <>
          <Typography>
            Vælg en integration til din virksomhed fra listen.
          </Typography>
          {!integrationsQuery?.data?.length ? <CircularProgress /> : (
            <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 3.5 }}>
              {Object.values(integrations).map((integration) => {
                return (
                  <Grid item xs={12} md={4} sx={{ pt: 0 }}>
                    <Card>
                      <CardActionArea onClick={onCreateNewIntegration(integration)}>
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
        </>
      )
    }
  }

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={onClose}
      title={`Opret ny integration${integrations?.[newIntegration] ? ` til ${integrations[newIntegration].name}` : ''}`}
      actions={<Button onClick={onClose} variant="contained">Luk</Button>}
    >
      {dialogContent}
    </Dialog>
  )
}

const integrationTypes = {
  'bookkeeping': 'bogføring',
  'cms': 'cms',
  'acquiring': 'indløsning',
  'gateway': 'gateway',
}

const IntegrationActiveSwitch = ({ integration }) => {
  const [ updateIntegrationLink, updateIntegrationLinkMutation ] = useMutation(UPDATE_INTEGRATION_LINK);
  const handleChange = async (_, checked) => {
    updateIntegrationLink({
      variables: {
        id: integration.id,
        data: {
          active: checked,
        },
      },
    })
  }
  return updateIntegrationLinkMutation.loading ? <Box display="inline-flex" sx={{ transform: 'translateY(8px)' }}><CircularProgress size={24} sx={{ mr: 2 }} /></Box> : <Switch checked={integration.active} onChange={handleChange} />
}

export default function GeneralAppPage() {
  
  const router = useRouter()
  const { user } = useAuthContext()

  const merchantId = parseInt(router.hashParams.get('merchant'), 10);

  const integrations = useQuery(GET_INTEGRATIONS, {
    variables: { merchantId },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const [ doDeleteIntegration, deleteIntegrationMutation ] = useMutation(DELETE_INTEGRATION_LINK);

  const Popover = usePopover()

  const theme = useTheme()

  const { themeStretch } = useSettingsContext()

  const [ deleteIntegration, ConfirmDeleteIntegrationDialog ] = useConfirmDialog({
    onConfirm: async (id) => {
      await doDeleteIntegration({ variables: { id } });
      integrations.refetch();
    },
  })
  
  return (
    <>

      <NewIntegrationDialog
        open={router.hashParams.get('new_integration')}
        onClose={() => router.updateHashParams({ new_integration: null })}
        onIntegrationCompleted={() => {
          integrations.refetch();
          router.updateHashParams({ new_integration: null });
        }}
      />

      <ConfirmDeleteIntegrationDialog
        title="Slet integration?"
        confirmLabel="Slet"
        confirmColor="error"
      >
        <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette denne integration?</Typography>
        <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
      </ConfirmDeleteIntegrationDialog>

      <Head>
        <title>PayPilot | Integrationer</title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

        <Grid item container xs={12}>
          <Grid item xs={12} md={8} >
            <Typography variant="h4">
              Integrationer
            </Typography>
            <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
              Se de nuværende eller opret nye integrationer for den valgte virksomhedsprofil.
            </Typography>
          </Grid>
          <Grid item container xs={12} md={4} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
            <Popover.Component control={<CustomButton icon={<Iconify icon="fluent:chevron-down-20-filled" />}>Handling</CustomButton>}>
              <MenuItem onClick={() => {
                router.updateHashParams({
                  new_integration: 1,
                })
              }}>Opret ny integration</MenuItem>
            </Popover.Component>
          </Grid>
        </Grid>

        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75 }}>
          {!integrations.data || integrations.loading || deleteIntegrationMutation.loading ? (
            <Grid item xs={12} md={12}>
              <CenteredLoadingIndicator />
            </Grid>
          ) : (
            integrations.data.map((integration, index) => {
              integration = {
                ...integration.integration,
                active: integration.active,
                healthy: integration.healthy,
                id: integration.id,
              }
              integration.completionPercent = 100
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
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
                          <>
                            <IntegrationActiveSwitch integration={integration} />
                            <MoreActionsButton
                              actions={[
                                { label: 'Slet', onClick: () => deleteIntegration(integration.id) },
                              ]}
                            />
                          </>
                        }
                      />
                      <CardContent>
                        <Typography variant="h6" color="text.primary">
                          {integration.name}
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          {ucfirst(integrationTypes[integration.type])}
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
                  </Card>
                </Grid>
              )
            })
          )}
        </Grid>
      </Container>
    </>
  );
}
