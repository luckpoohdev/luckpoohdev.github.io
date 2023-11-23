// react
import { useState } from 'react'
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  Card,
  TextField,
  CardHeader,
  CardContent,
  CardActionArea,
  Button,
  Typography,
  LinearProgress,
  CircularProgress,
  Stack,
  Box,
} from '@mui/material';
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

import AllSettlements from 'src/components/settlements/all';
import _mock from 'src/_mock';
import { randomInArray } from 'src/_mock';
import TransactionHistoryDialog from 'src/components/transactions/history-dialog';

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

import InputAdornment from '@mui/material/InputAdornment'

export default function GeneralAppPage() {
  
  const router = useRouter()
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);
  const { user } = useAuthContext()
  const { stores } = useSelector((state) => ({
    stores: state?.merchant?.userMerchants?.[merchantId]?.stores ?? [],
  }))
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

      <TransactionHistoryDialog />

      <ConfirmDeleteStoreDialog
        title="Slet salgssted?"
        content={(
          <>
            <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette dette salgssted?</Typography>
            <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
          </>
        )}
        confirmLabel="Slet"
        confirmColor="error"
      />

      <Head>
        <title>PayPilot | Betalinger > Afregninger</title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

        <Grid item container xs={12}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4">
              Afregninger
            </Typography>
            <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
              Her kan du se alle dine afregninger
            </Typography>
          </Grid>
          <Grid item container xs={12} md={8} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
          </Grid>
        </Grid>

        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75 }}>

          <Grid item xs={12} sx={{ height: '75vh' }}>
            <AllSettlements merchantId={merchantId} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
