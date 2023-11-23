// react
import * as React from 'react'
import { useEffect, useMemo } from 'react'
// apollo
import { useMutation } from '@apollo/client'
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  Typography,
  Stack,
} from '@mui/material';
// auth
import { useAuthContext } from 'src/auth/useAuthContext';
// layouts
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
// components
import { useSettingsContext } from 'src/components/settings';
import CenteredLoadingIndicator from '@/components/centered-loading-indicator';

import { useSelector } from 'src/redux/store';
import usePopover from 'src/hooks/usePopover';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useForm } from 'react-hook-form';
import useRouter from 'src/hooks/useRouter';
import {
  GET_MERCHANT_ACCOUNTING_ACCOUNTS, GET_MERCHANT_ACCOUNTING_VAT_ACCOUNTS, GET_MERCHANT_ACCOUNTING_JOURNALS, GET_MERCHANT_ACCOUNTING_DEPARTMENTS, SAVE_MERCHANT_ACCOUNTING_SETUP,
  GET_INTEGRATION_LINK,
} from 'src/queries/accounting';
import { GET_ACQUIRING_PROVIDERS } from 'src/queries/provider';
// hooks
import { useQuery } from 'src/hooks/apollo';
// ----------------------------------------------------------------------

import useConfirmDialog from 'src/hooks/useConfirmDialog';
import BookkeepingConfigForm from 'src/components/bookkeeping-config-form';
import AutomaticBookkeepingSwitch from 'src/components/automatic-bookkeeping-switch';

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------



export default function GeneralAppPage() {
  
  const router = useRouter()
  const { user } = useAuthContext()
  
  const merchantId = parseInt(router.hashParams.get('merchant'), 10)

  const { stores } = useSelector((state) => ({
    stores: state?.merchant?.userMerchants?.[merchantId]?.stores ?? [],
  }))
  const Popover = usePopover()

  const integrationLinkQuery = useQuery(GET_INTEGRATION_LINK, {
    variables: {
      type: 'bookkeeping',
      merchantId,
      getClosest: true,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const journalsQuery = useQuery(GET_MERCHANT_ACCOUNTING_JOURNALS, {
    variables: {
      merchantId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const accountsQuery = useQuery(GET_MERCHANT_ACCOUNTING_ACCOUNTS, {
    variables: {
      merchantId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const vatAccountsQuery = useQuery(GET_MERCHANT_ACCOUNTING_VAT_ACCOUNTS, {
    variables: {
      merchantId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const departmentsQuery = useQuery(GET_MERCHANT_ACCOUNTING_DEPARTMENTS, {
    variables: {
      merchantId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const acquiringProvidersQuery = useQuery(GET_ACQUIRING_PROVIDERS, {
    variables: {
      merchantId,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const [ saveMerchantAccountingSetup, merchantAccountingSetupMutation ] = useMutation(SAVE_MERCHANT_ACCOUNTING_SETUP)

  const currentSetup = useMemo(() => {
    if (integrationLinkQuery?.data?.config) {
      console.log(JSON.parse(integrationLinkQuery?.data?.config));
      integrationLinkQuery.data.config = {
        setup: JSON.parse(integrationLinkQuery?.data?.config)?.setup,
      };
    }
    return integrationLinkQuery.data;
  }, [ integrationLinkQuery?.data ]);

  const methods = useForm()

  useEffect(() => {
    if (currentSetup) {
      methods.reset({
        ...currentSetup.config.setup,
        automatic_bookkeeping: currentSetup.active,
      });
    }
  }, [currentSetup]);

  const onSubmit = (data) => {
    delete data.automatic_bookkeeping;
    saveMerchantAccountingSetup({
      variables: {
        merchantId,
        setup: JSON.stringify(data),
      }
    })
  }

  const journalOptions = useMemo(() => {
    return journalsQuery?.data?.map((journal) => {
      return { label: journal.name, value: journal.id }
    }) ?? [];
  }, [ journalsQuery?.data ]);

  const accountOptions = useMemo(() => {
    return accountsQuery?.data?.map((account) => {
      return account.parent ? { label: `${account.number} - ${account.name}`, value: account.number, groupBy: `${account.parent.number} - ${account.parent.name}` } : null
    })?.filter((account) => account) ?? [];
  }, [ accountsQuery?.data ]);

  const vatAccountOptions = useMemo(() => {
    return vatAccountsQuery?.data?.map((vatAccount) => {
      return { label: `${vatAccount.vatCode} - ${vatAccount.name}`, value: vatAccount.vatCode }
    }) ?? [];
  }, [ vatAccountsQuery?.data ]);

  const departmentOptions = useMemo(() => {
    return [{ label: 'Ingen', value: null }].concat(departmentsQuery?.data?.map((department) => {
      return { label: department.name, value: department.id };
    })) ?? [];
  }, [ departmentsQuery?.data ]);

  const loading = integrationLinkQuery.loading || merchantAccountingSetupMutation.loading || departmentsQuery.loading || journalsQuery.loading || accountsQuery.loading || vatAccountsQuery.loading || acquiringProvidersQuery.loading;

  const disabled = !journalsQuery?.data?.length || !accountsQuery?.data?.length || !vatAccountsQuery?.data?.length;

  return (
    <>

      <Head>
        <title>PayPilot | Bogføring </title>
      </Head>

      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>

        <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

          <Grid item container xs={12}>
            <Grid item xs={12} md={12}>
              <Typography variant="h4">
                Bogføring
              </Typography>
              <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
                {(disabled && !loading) ? (
                  'Kunne ikke få fat i dine bogføringsdata. Har du sat en bogføringsintegration op endnu?'
                ) : (
                  'Her kan du opsætte dine bogføringsindstillinger for hele din virksomhed. Bemærk at det også er muligt at køre specifikke opsætninger på enkelte løsninger eller salgssteder.'
                )}
              </Typography>
            </Grid>
            {(!disabled || loading) && (
              loading ? (
                <CenteredLoadingIndicator />
              ) : (
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2}>
                    <AutomaticBookkeepingSwitch merchantId={merchantId} />
                  </Stack>
                </Grid>
              )
            )}
          </Grid>
          {!disabled && (
            <BookkeepingConfigForm
              accountOptions={accountOptions}
              journalOptions={journalOptions}
              vatAccountOptions={vatAccountOptions}
              departmentOptions={departmentOptions}
              acquiringProviders={acquiringProvidersQuery?.data ?? []}
            />
          )}
        </Container>
      </FormProvider>
    </>
  );
}