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
  import { TicketTableToolbar, TicketTableRow } from 'src/sections/@dashboard/tickets';
  
  // ----------------------------------------------------------------------
  
  const STATUS_OPTIONS = ['all', 'open', 'closed'];
  const STATUS_LABELS = { all: 'Alle', open: 'Åbne', closed: 'Afsluttede' }
  
  const FILTER_TYPE_OPTIONS = [
    { value: 'subject', label: 'Emne' },
    { value: 'category', label: 'Kategori' },
  ];
  
  const TABLE_HEAD = [
    { id: 'creator', label: 'Oprettet af', align: 'left' },
    { id: 'subject', label: 'Emne', align: 'left' },
    { id: 'category', label: 'Kategori', align: 'left' },
    { id: 'priority', label: 'Prioritet', align: 'center' },
    { id: 'status', label: 'Status', align: 'center' },
    { id: '' },
  ];

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

const OssTaxCountries = () => {
    const ossTaxCountries = useWatch({ name: 'selected_oss_tax_countries' }) ?? []
    return (
      <>
        <Grid item xs={12} sx={{ mx: 3, mt: 3 }}>
          <Typography variant="subtitle1">Opsæt specifik kontoplan for særskilte lande (OSS Moms)</Typography>
          <RHFCountrySelect
            name="selected_oss_tax_countries"
            label="Valgte lande"
            placeholder="Tilføj land..."
            multiple
            sx={{ mt: 3 }}
          />
        </Grid>
        {ossTaxCountries.sort().map((ossTaxCountryCode, key) => {
          const prefix = `oss_tax_countries.${ossTaxCountryCode}.`
          return (
            <Grid item xs={12} key={key}>
              <CollapsibleCard defaultCollapsed={true} unmountOnExit={false}>
                <CardHeader title={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CountryFlag code={ossTaxCountryCode} />
                    <Typography variant="subtitle1">Kontoplan for salg til {ossTaxCountryCode}</Typography>
                  </Stack>
                } />
                <CardContent>
                  <Grid container rowSpacing={3} columnSpacing={2} sx={{ pt: 1 }}>
                    <Grid item xs={12}><RHFAutocomplete name={`${prefix}department`} label="Afdeling" required options={[{ label: 'MyAdvisoa Germany', value: '23' }]} placeholder="Vælg afdeling..." /></Grid>
                    <Grid item xs={12}><RHFAutocomplete name={`${prefix}vat_code_sales`} label="Momskode for salg med moms" required options={[{ label: `${ossTaxCountryCode}25 - Udgående (salg)`, value: `${ossTaxCountryCode}25` }]} /></Grid>
                    <Grid item xs={12}><RHFAutocomplete name={`${prefix}no_vat_code_sales`} label="Momskode for salg uden moms" required options={[{ label: `${ossTaxCountryCode}26 - Udgående (salg uden moms)`, value: `${ossTaxCountryCode}26` }]} /></Grid>
                    <Grid item xs={6}><Typography variant="subtitle1">Kontoplan for salg</Typography></Grid>
                    <Grid item xs={6}><Typography variant="subtitle1">Kontoplan for refunderinger</Typography></Grid>
                    <Grid item xs={6}><RHFAutocomplete name={`${prefix}vat_product_sale_account`} label="Salg af varer med moms" required options={[{ label: '5509 Varesalg med moms', value: '5509' }]} /></Grid>
                    <Grid item xs={6}><RHFAutocomplete name={`${prefix}vat_product_refund_account`} label="Refundering af varer med moms" required options={[{ label: '5519 Varerefundering med moms', value: '5519' }]} /></Grid>
                    <Grid item xs={6}><RHFAutocomplete name={`${prefix}no_vat_product_sale_account`} label="Salg af varer uden moms" required options={[{ label: '5505 Varesalg uden moms', value: '5505' }]} /></Grid>
                    <Grid item xs={6}><RHFAutocomplete name={`${prefix}no_vat_product_sale_refund`} label="Refundering af varer uden moms" required options={[{ label: '5506 Varerefundering uden moms', value: '5506' }]} /></Grid>
                    <Grid item xs={6}><RHFAutocomplete name={`${prefix}vat_service_sale_account`} label="Salg af ydelser med moms" required options={[{ label: '4609 Salg af ydelse med moms', value: '4609' }]} /></Grid>
                    <Grid item xs={6}><RHFAutocomplete name={`${prefix}vat_service_refund_account`} label="Refundering af ydelser med moms" required options={[{ label: '4611 Refundering af ydelse med moms', value: '4611' }]} /></Grid>
                    <Grid item xs={6}><RHFAutocomplete name={`${prefix}no_vat_service_sale_account`} label="Salg af ydelser uden moms" required options={[{ label: '4670 Salg af ydelse uden moms', value: '4670' }]} /></Grid>
                    <Grid item xs={6}><RHFAutocomplete name={`${prefix}no_vat_service_refund_account`} label="Refundering af ydelser uden moms" required options={[{ label: '4672 Refundering af ydelse uden moms', value: '4672' }]} /></Grid>
                    <Grid item xs={6}><RHFAutocomplete name={`${prefix}vat_shipping_sale_account`} label="Salg af fragt med moms" required options={[{ label: '4616 Salg af fragt med moms', value: '4616' }]} /></Grid>
                    <Grid item xs={6}><RHFAutocomplete name={`${prefix}vat_shipping_refund_account`} label="Refundering af fragt med moms" required options={[{ label: '4616 Refundering af fragt med moms', value: '4616' }]} /></Grid>
                    <Grid item xs={6}><RHFAutocomplete name={`${prefix}no_vat_shipping_sale_account`} label="Salg af fragt uden moms" required options={[{ label: '4616 Salg af fragt uden moms', value: '4616' }]} /></Grid>
                    <Grid item xs={6}><RHFAutocomplete name={`${prefix}no_vat_shipping_refund_account`} label="Refundering af fragt uden moms" required options={[{ label: '4617 Refundering af fragt uden moms', value: '4617' }]} /></Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" fullWidth>Gem indstillinger</Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </CollapsibleCard>
            </Grid>
          )
        })}
      </>
    )
  }

export default function GeneralAppPage() {
  
  const router = useRouter()
  const { user } = useAuthContext()
  const { stores } = useSelector((state) => ({
    stores: state?.merchant?.userMerchants?.[router.hashParams.get('merchant')]?.stores ?? [],
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

  const defaultFormValues = {
    automatic_bookkeeping: true,
    solution_specific_bookkeeping: true,
    bookkeep_business_sales_as_b2b: true,
    accounting_year_follows_calendar_year: true,
    tax_required_country: 'DK',
    delivery_address_alternative_country: 'DK',
    ledger: 'my_advisoa',
    payments_allocation_account: '5500',
    rounding_difference_account: '5501',
    foreign_exchange_loss_account: '5502',
    foreign_exchange_gain_account: '5507',
    b2c: {
      vat_code_sales: 'U25',
      no_vat_code_sales: 'U26',
      vat_product_sale_account: '5509',
      vat_product_refund_account: '5519',
      no_vat_product_sale_account: '5505',
      no_vat_product_sale_refund: '5506',
      vat_service_sale_account: '4609',
      vat_service_refund_account: '4611',
      no_vat_service_sale_account: '4670',
      no_vat_service_refund_account: '4672',
      vat_shipping_sale_account: '4616',
      vat_shipping_refund_account: '4616',
      no_vat_shipping_sale_account: '4616',
      no_vat_shipping_refund_account: '4617',
    },
    b2b: {
      vat_code_sales: 'U25',
      no_vat_code_sales: 'U26',
      vat_product_sale_account: '5509',
      vat_product_refund_account: '5519',
      no_vat_product_sale_account: '5505',
      no_vat_product_sale_refund: '5506',
      vat_service_sale_account: '4609',
      vat_service_refund_account: '4611',
      no_vat_service_sale_account: '4670',
      no_vat_service_refund_account: '4672',
      vat_shipping_sale_account: '4616',
      vat_shipping_refund_account: '4616',
      no_vat_shipping_sale_account: '4616',
      no_vat_shipping_refund_account: '4617',
    },
    non_eu: {
      vat_code_sales: 'U25',
      no_vat_code_sales: 'U26',
      vat_product_sale_account: '5509',
      vat_product_refund_account: '5519',
      no_vat_product_sale_account: '5505',
      no_vat_product_sale_refund: '5506',
      vat_service_sale_account: '4609',
      vat_service_refund_account: '4611',
      no_vat_service_sale_account: '4670',
      no_vat_service_refund_account: '4672',
      vat_shipping_sale_account: '4616',
      vat_shipping_refund_account: '4616',
      no_vat_shipping_sale_account: '4616',
      no_vat_shipping_refund_account: '4617',
    },
    selected_oss_tax_countries: ['DE'],
    oss_tax_countries: {
      DE: {
        vat_code_sales: 'DE25',
        no_vat_code_sales: 'DE26',
        vat_product_sale_account: '5509',
        vat_product_refund_account: '5519',
        no_vat_product_sale_account: '5505',
        no_vat_product_sale_refund: '5506',
        vat_service_sale_account: '4609',
        vat_service_refund_account: '4611',
        no_vat_service_sale_account: '4670',
        no_vat_service_refund_account: '4672',
        vat_shipping_sale_account: '4616',
        vat_shipping_refund_account: '4616',
        no_vat_shipping_sale_account: '4616',
        no_vat_shipping_refund_account: '4617',
      },
    },
  }
  const methods = useForm()
  useEffect(() => {
    methods.reset(defaultFormValues)
  }, [])
  const onSubmit = (data) => {
    console.log('data', data)
  }

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


  const { push } = useRouter();

  const [tableData, setTableData] = useState(_ticketList);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [ filterKeywords, setFilterKeywords ] = useState(router.hashParams.get('keywords'))
  const deferredKeywords = useDeferredValue(filterKeywords)
  const filterType = router.hashParams.get('filter') ?? 'subject'
  const filterSubject = filterType === 'subject' ? deferredKeywords : null
  const filterCategory = filterType === 'category' ? deferredKeywords : null
  const filterStatus = router.hashParams.get('status') ?? 'all'

  console.log('filterCategory', filterCategory, 'filterSubject', filterSubject)

  const dataFiltered = useMemo(() => (
    applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterSubject,
        filterCategory,
        filterStatus,
      })
  ), [ deferredKeywords, filterType, filterStatus ]);

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterSubject !== '' || filterCategory !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterSubject) ||
    (!dataFiltered.length && !!filterCategory) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    router.updateHashParams({
        status: newValue === 'all' ? null : newValue,
    })
  };

  const handleFilterTypeChange = (event) => {
    setPage(0);
    router.updateHashParams({
        filter: event.target.value === 'subject' ? null : event.target.value,
    }, true)
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
    push(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const handleResetFilter = () => {
    router.updateHashParams({
        filter: null,
        keywords: null,
        status: null,
    }, true)
    setFilterKeywords(null)
  };

  const handleCreateNewTicket = () => {
    router.push('/tickets/create')
  }

  useEffect(() => {
    if (router.hashParams.get('keywords') !== filterKeywords) setFilterKeywords(router.hashParams.get('keywords') ?? null)
  }, [ router.hashParams.get('keywords') ])
  
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
        <title>PayPilot | Tickets </title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

        <Grid item container xs={12}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4">
              Tickets
            </Typography>
            <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
            Se og administrer dine igangværende tickets forneden - eller opret en ny
            </Typography>
          </Grid>
          <Grid item container xs={12} md={8} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
            <CustomButton onClick={handleCreateNewTicket} icon={<Iconify icon="material-symbols:add-rounded" />}>Opret ticket</CustomButton>
          </Grid>
        </Grid>

        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75 }}>
          <Grid item xs={12}>

          <Card>
          <Tabs
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab} label={STATUS_LABELS[tab]} value={tab} />
            ))}
          </Tabs>

          <Divider />
          <TicketTableToolbar
            isFiltered={isFiltered}
            filterType={filterType}
            filterKeywords={filterKeywords}
            filterTypes={FILTER_TYPE_OPTIONS}
            onFilterTypeChange={handleFilterTypeChange}
            onKeywordsChange={handleKeywordsChange}
            onKeywordsBlur={handleKeywordsBlur}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
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
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TicketTableRow
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

function applyFilter({ inputData, comparator, filterSubject, filterCategory, filterStatus }) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);
  
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
  
    inputData = stabilizedThis.map((el) => el[0]);
  
    if (filterSubject) {
      inputData = inputData.filter(
        (ticket) => ticket.subject.toLowerCase().indexOf(filterSubject.toLowerCase()) !== -1
      );
    }

    if (filterCategory) {
        inputData = inputData.filter(
          (ticket) => ticket.category.toLowerCase().indexOf(filterCategory.toLowerCase()) !== -1
        );
      }
  
    if (filterStatus !== 'all') {
      inputData = inputData.filter((ticket) => ticket.status === filterStatus);
    }
  
    return inputData;
  }
  