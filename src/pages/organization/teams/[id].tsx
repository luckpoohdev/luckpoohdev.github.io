// react
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import { useState, useEffect, useDeferredValue, useMemo } from 'react'
// hook form
import { useWatch } from 'react-hook-form'
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
  Switch,
  FormGroup,
  FormControlLabel,
  Tab,
  Tabs,
  Table,
  Tooltip,
  Divider,
  TableBody,
  IconButton,
  TableContainer,
} from '@mui/material';
// scrollbar
import Scrollbar from 'src/components/scrollbar';
// framer
import { checkTargetForNewValues, useIsomorphicLayoutEffect } from 'framer-motion';
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
// _mock_
import { _userList } from 'src/_mock/arrays';
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
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import FormProvider from 'src/components/hook-form/FormProvider';
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
// hooks
import { useQuery } from 'src/hooks/apollo';
// ----------------------------------------------------------------------

import { CircularProgress, AvatarGroup, Avatar } from '@mui/material';
import img from 'src/utils/img';
import useConfirmDialog from 'src/hooks/useConfirmDialog';
import AllSales from 'src/components/sales/all';
import Dialog from 'src/components/custom-dialog';
import { AcquiringServiceCard, GatewayServiceCard } from 'src/components/service-card';
import { _userCards } from 'src/_mock/arrays';
import TransactionHistoryDialog from 'src/components/transactions/history-dialog';
import CollapsibleCard from 'src/components/collapsible-card';
import { RHFTextField, RHFAutocomplete, RHFCountrySelect, RHFSwitch, RHFRadioGroup } from 'src/components/hook-form';
import CountryFlag from 'src/components/country-flag';

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  
  const router = useRouter()
  
  const handleCancelCreateNewTeam = () => {
    router.push(PATH_APP.organization.teams.root)
  }

  return (
    <>

      <Head>
        <title>PayPilot | Teams</title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

        <Grid item container xs={12}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4">
              Teams > 
            </Typography>
            <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
            Her kan du se og håndtere et hold
            </Typography>
          </Grid>
          <Grid item container xs={12} md={8} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
          
          </Grid>
        </Grid>

        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75 }}>
          <Grid item xs={12}>

         Design mangler :(

          </Grid>
        </Grid>
      </Container>
    </>
  );
}


// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterRole, filterKeywords, filterStatus }) {
  
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  
  inputData = stabilizedThis.map((el) => el[0]);
  
  if (filterKeywords) {
    inputData = inputData.filter(
      (user) => (
        user.name.toLowerCase().indexOf(filterKeywords.toLowerCase()) !== -1
        || user.team.toLowerCase().indexOf(filterKeywords.toLowerCase()) !== -1
      )
    );
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter(
      (user) => user.role === filterRole
    );
  }
  
  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }
  
  return inputData;
}
  