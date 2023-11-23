import { useState } from 'react';
// next
import Head from 'next/head';
// @mui
import {
  Tab,
  Card,
  Tabs,
  Container,
  Box,
  Grid,
  MenuItem,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
// routes
// auth
import { useAuthContext } from 'src/auth/useAuthContext';
// _mock_
import {
  _userDetails,
} from 'src/_mock/arrays';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
// sections
import {
  Profile,
  MerchantForm,
  ContactForm,
  ProfileCover,
} from 'src/sections/@dashboard/merchant/profile';

import Label from 'src/components/label/Label';

import Icon from 'src/components/Icon';

import usePopover from 'src/hooks/usePopover';
import useRouter from 'src/hooks/useRouter';
import useConfirmDialog from 'src/hooks/useConfirmDialog';
import { useQuery } from 'src/hooks/apollo';
import { GET_MERCHANT_PROFILE } from 'src/queries/merchant';

import CustomButton from 'src/components/custom-button';

import img from 'src/utils/img';

// ----------------------------------------------------------------------

MerchantProfilePage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function MerchantProfilePage() {

  const router = useRouter()

  const merchantId = parseInt(router.hashParams.get('merchant'), 10)

  const merchant = useQuery(GET_MERCHANT_PROFILE, { variables: { id: merchantId } })

  const { themeStretch } = useSettingsContext();

  const currentTab = router.hashParams.get('tab') ?? 'general'

  const TABS = [
    {
      value: 'general',
      label: 'generelt',
      icon: <Icon name="ic_edit" />,
      component: <MerchantForm data={merchant.data} />,
    }, {
      value: 'contact',
      label: 'kontaktperson',
      icon: <Icon name="ic_profile" />,
      component: <ContactForm data={merchant.data} />,
    },
  ];

  const UserActionPopover = usePopover()
  const [ deleteUser, ConfirmDeleteUserDialog ] = useConfirmDialog({
    onConfirm: () => null,
  })

  const setCurrentTab = (tab) => router.updateHashParams({ tab: tab === 'general' ? null : tab })

  if (!merchant.data) return <CircularProgress />
  
  return (
    <>

      <Head>
        <title>PayPilot | Organisationsindstillinger</title>
      </Head>

      <ConfirmDeleteUserDialog
        title="Advarsel!"
        confirmLabel="Slet"
        confirmColor="error"
      >
        <Typography variant="inherit" gutterBottom>Der er ingen vej tilbage fra denne handling.</Typography>
        <Typography variant="inherit" gutterBottom>Sletter du en virksomhed er den væk, for altid.</Typography>
        <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
      </ConfirmDeleteUserDialog>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

        <Grid item container xs={12}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h4">
                {merchant.data.name}
              </Typography>
              <Label color="default">CVR: {merchant.data.vat_number}</Label>
            </Stack>
            <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
              Se og rediger virksomhedsprofilen forneden
            </Typography>
          </Grid>
          <Grid item container xs={12} md={8} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
          <UserActionPopover.Component control={<CustomButton icon={<Icon name="ic_chevron_down" />}>Handling</CustomButton>}>
            <MenuItem onClick={deleteUser}>Slet</MenuItem>
          </UserActionPopover.Component>
          </Grid>
        </Grid>

        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75 }}>
          <Grid item xs={12}>

        <Card
          sx={{
            mb: 1,
            height: 280,
            position: 'relative',
          }}
        >
          <ProfileCover name={merchant.data.name} industry={merchant.data.industry?.name} avatarUrl={merchant.data.logo?.url ? img(merchant.data.logo.url) : null} cover={merchant.data.cover?.url ? img(merchant.data.cover?.url) : null} />

          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              position: 'absolute',
              bgcolor: 'background.paper',
              '& .MuiTabs-flexContainer': {
                pr: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-end',
                },
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Card>

        </Grid>

        {TABS.map(
          (tab) => tab.value === currentTab && tab.component
        )}


        </Grid>
      </Container>
    </>
  );
}
