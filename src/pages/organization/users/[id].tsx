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
  UserForm,
  SettingsForm,
  ProfileCover,
  ProfileFriends,
  ProfileGallery,
  ProfileFollowers,
} from 'src/sections/@dashboard/user/profile';

import Label from 'src/components/label/Label';

import Icon from 'src/components/Icon';

import usePopover from 'src/hooks/usePopover';
import useRouter from 'src/hooks/useRouter';
import useConfirmDialog from 'src/hooks/useConfirmDialog';

import CustomButton from 'src/components/custom-button';

// ----------------------------------------------------------------------

UserProfilePage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function UserProfilePage() {

  const router = useRouter()

  const { themeStretch } = useSettingsContext();


  const currentTab = router.hashParams.get('tab') ?? 'details'

  const TABS = [
    {
      value: 'details',
      label: 'Detaljer',
      icon: <Icon name="ic_profile" />,
      component: <Profile info={_userDetails} />,
    },
    {
      value: 'edit',
      label: 'Rediger bruger',
      icon: <Icon name="ic_edit" />,
      component: <UserForm info={_userDetails} />,
    },
    {
      value: 'settings',
      label: 'Indstillinger',
      icon: <Icon name="ic_setting" />,
      component: <SettingsForm info={_userDetails} />,
    },
  ];

  const UserActionPopover = usePopover()
  const [ deleteUser, ConfirmDeleteUserDialog ] = useConfirmDialog({
    onConfirm: () => null,
  })

  const setCurrentTab = (tab) => router.updateHashParams({ tab: tab === 'details' ? null : tab })

  return (
    <>

      <Head>
        <title>PayPilot | Brugere</title>
      </Head>

      <ConfirmDeleteUserDialog
        title="Slet bruger?"
        confirmLabel="Slet"
        confirmColor="error"
      >
        <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette denne bruger?</Typography>
        <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
      </ConfirmDeleteUserDialog>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

        <Grid item container xs={12}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h4">
                {_userDetails.name}
              </Typography>
              <Label color="default">{_userDetails.role === 'user' ? 'Bruger' : 'Admin'}</Label>
            </Stack>
            <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
              Se og rediger brugerprofilen forneden
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
          <ProfileCover name={_userDetails.name} profession={_userDetails.profession} avatarUrl={_userDetails.avatarUrl} cover={_userDetails.cover} />

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
