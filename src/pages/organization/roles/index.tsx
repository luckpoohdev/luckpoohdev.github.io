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
import TransactionHistoryDialog from 'src/components/transactions/history-dialog';
import CollapsibleCard from 'src/components/collapsible-card';
import { RHFTextField, RHFAutocomplete, RHFCountrySelect, RHFSwitch, RHFRadioGroup } from 'src/components/hook-form';
import CountryFlag from 'src/components/country-flag';

import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
  } from 'src/components/table';
  // sections
  import { RoleTableToolbar, RoleTableRow } from 'src/sections/@dashboard/roles/list';
  
  // ----------------------------------------------------------------------
  
  const STATUS_OPTIONS = ['all', 'active', 'deactivated'];
  const STATUS_LABELS = { all: 'Alle', active: 'Aktive', deactivated: 'Deaktiverede' }
  
  const TABLE_HEAD = [
    { id: 'name', label: 'Navn', align: 'left' },
    { id: 'member_count', label: 'Medlemmer', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
    { id: '' },
  ];

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  
  const router = useRouter()

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();


  const { push } = router;
  
  const [tableData, setTableData] = useState([
    { id: 1, name: 'Standard', description: 'Indbygget brugerrolle med seer adgang til en begrænset mængde indhold. Brugbar til eksempelvis en bogholder. Denne rolle kan ikke rettigeres eller slettes.', assigned_user_count: 25, locked: true },
    { id: 2, name: 'Admin', description: 'Indbygget brugerrolle med rettigheder til alt. Denne rolle kan ikke rettigeres eller slettes.', assigned_user_count: 3, locked: true },
  ]);

  const [ filterKeywords, setFilterKeywords ] = useState(router.hashParams.get('keywords') ?? '')
  const deferredKeywords = useDeferredValue(filterKeywords)
  const filterStatus = router.hashParams.get('status') ?? 'all'

  const dataFiltered = useMemo(() => (
    applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterKeywords,
        filterStatus,
      })
  ), [ deferredKeywords, filterStatus ]);

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterKeywords || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterKeywords) ||
    (!dataFiltered.length && !!filterStatus);

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    router.updateHashParams({
        status: newValue === 'all' ? null : newValue,
    })
  };

  const handleKeywordsChange = (event) => {
    setPage(0);
    setFilterKeywords(event.target.value?.length ? event.target.value : null)
  };

  const handleKeywordsBlur = () => {
    router.updateHashParams({
        keywords: filterKeywords,
    }, true)
  }

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id) => {
    push(PATH_DASHBOARD.role.edit(paramCase(id)));
  };

  const handleResetFilter = () => {
    router.updateHashParams({
        keywords: null,
        status: null,
    }, true)
    setFilterKeywords(null)
  };

  const handleCreateNewRole = () => {
    router.push(PATH_APP.organization.roles.create())
  }

  useEffect(() => {
    if (router.hashParams.get('keywords') !== filterKeywords) setFilterKeywords(router.hashParams.get('keywords') ?? null)
  }, [ router.hashParams.get('keywords') ])
  
  return (
    <>

      <Head>
        <title>PayPilot | Roller</title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

        <Grid item container xs={12}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4">
              Roller
            </Typography>
            <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
            Se og administrer roller forneden
            </Typography>
          </Grid>
          <Grid item container xs={12} md={8} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
            <CustomButton onClick={handleCreateNewRole} icon={<Iconify icon="material-symbols:add-rounded" />}>Opret ny rolle</CustomButton>
          </Grid>
        </Grid>

        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75 }}>
          <Grid item xs={12}>

          <Card>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.filter((row) => !row.locked).map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={() => null}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.filter((row) => !row.locked).map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <RoleTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.name)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
          />
        </Card>

          </Grid>
        </Grid>
      </Container>
    </>
  );
}


// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterKeywords, filterStatus }) {
  
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  
  inputData = stabilizedThis.map((el) => el[0]);
  
  if (filterKeywords) {
    inputData = inputData.filter(
      (role) => (
        role.name.toLowerCase().indexOf(filterKeywords.toLowerCase()) !== -1
      )
    );
  }
  
  if (filterStatus !== 'all') {
    inputData = inputData.filter((role) => role.status === filterStatus);
  }
  
  return inputData;
}
  