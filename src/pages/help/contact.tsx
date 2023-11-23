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

  const Popover = usePopover()

  const theme = useTheme()

  const { themeStretch } = useSettingsContext()

  const { push } = useRouter();

  const tawk = useTawk()
  
  return (
    <>

      <Head>
        <title>PayPilot | Kontakt </title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

        <Grid item container xs={12}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4">
            Kontakt
            </Typography>
            <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
            Har du spørgsmål eller brug for hjælp? Kontakt os forneden
            </Typography>
          </Grid>
          <Grid item container xs={12} md={8} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
          </Grid>
        </Grid>

        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Live chat" />
              <CardContent>
                <Stack direction="row" spacing={3}>
                  <Box>
                    <CustomAvatar src="/assets/images/portraits/dkp.jpg" BadgeProps={{ 
                      badgeContent: <BadgeStatus status="online" />,
                    }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Vi sidder klar til at besvare dine spørgsmål</Typography>
                    <Link
                      component="button"
                      variant="subtitle2"
                      onClick={() => tawk.maximize()}
                      sx={{ textTransform: 'none', cursor: 'pointer' }}
                      underline="none"
                      color="success.main"
                    >
                      Start chat
                    </Link>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Teknisk hjælp" />
              <CardContent>
                <Stack direction="row" spacing={3}>
                  <Box>
                    <Avatar>
                      <Icon name="ic_file" />
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Via tickets kan du få hjælp til generelle problemer</Typography>
                    <Link
                      component="button"
                      variant="subtitle2"
                      onClick={() => router.push(PATH_APP.tickets.create())}
                      sx={{ textTransform: 'none', cursor: 'pointer' }}
                      underline="none"
                    >
                      Opret ticket
                    </Link>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item container xs={12} md={4} rowSpacing={3.5}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Kontaktoplysninger" />
                <CardContent sx={{ pt: 1 }}>
                  <List dense>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemIcon>
                        <Icon name="ic_search" />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Link href="https://advisoa.dk" underline="none" target="_blank">www.advisoa.dk</Link>}
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemIcon>
                        <Icon name="ic_mail" />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Link href="mailto:support@advisoa.dk" underline="none">support@advisoa.dk</Link>}
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemIcon>
                        <Icon name="ic_call" />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Link href="tel:+4571904056" underline="none">+45 71 90 40 56</Link>}
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemIcon>
                        <Icon name="ic_external" />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Link href="https://advisoa.dk/help" target="_blank" underline="none">Hjælpecenter</Link>}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Åbningstider på telefon og chat" />
                <CardContent sx={{ pt: 1 }}>
                  <List dense>
                    <ListItem disablePadding sx={{ py: 2 }}>
                      <ListItemIcon>
                        <Avatar>
                          <Icon name="ic_call" />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary="Mandag til fredag"
                        secondary="08:00 - 17:00"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ py: 2 }}>
                      <ListItemIcon>
                        <Avatar>
                          <Icon name="ic_chat" />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary="Mandag til fredag"
                        secondary="08:00 - 17:00"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Grid>
      </Container>
    </>
  );
}
