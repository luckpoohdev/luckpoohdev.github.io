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
  Avatar,
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
  Link,
  FormControlLabel,
  Tab,
  Tabs,
  Table,
  Tooltip,
  Divider,
  TableBody,
  IconButton,
  TableContainer,
  List,
  ListItemText,
  ListItemIcon,
  ListItem,
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
import { _ticketList } from 'src/_mock/arrays';
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
import useTawk from 'src/hooks/useTawk';
// ----------------------------------------------------------------------

import { CircularProgress, AvatarGroup } from '@mui/material';
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
import { CustomAvatar } from 'src/components/custom-avatar';
import BadgeStatus from 'src/components/badge-status/BadgeStatus';
import Icon from 'src/components/Icon';

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  
  const router = useRouter()
  const { user } = useAuthContext()
  const [ productBoardLoaded, setProductBoardLoaded ] = useState(false)

  const Popover = usePopover()

  const theme = useTheme()

  const { themeStretch } = useSettingsContext()

  const { push } = useRouter();

  const tawk = useTawk()

  const onProductBoardLoaded = () => {
    setProductBoardLoaded(true)
  }
  
  return (
    <>

      <Head>
        <title>PayPilot | Produktopdateringer </title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

        <Grid item container xs={12}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4">
            Produktopdateringer
            </Typography>
            <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
            Her kan du se vores roadmap for kommende opdateringer
            </Typography>
          </Grid>
          <Grid item container xs={12} md={8} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
          </Grid>
        </Grid>

        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                {!productBoardLoaded && <CircularProgress />}
                <iframe src="https://roadmap.productboard.com/9e23db26-bf63-4e5c-9c93-584b041f5966" width="100%" height="530" frameborder="0" onLoad={onProductBoardLoaded}></iframe>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
