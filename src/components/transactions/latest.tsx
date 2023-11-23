import { useState, useMemo } from 'react';
import sumBy from 'lodash/sumBy';
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  CardHeader,
  Grid,
} from '@mui/material';
// routes
import { PATH_APP } from '../../routes/paths';
// _mock_
import { _sales } from '../../_mock/arrays';
// @types
import { IInvoice } from '../../@types/invoice';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import Label from '../label';
import Iconify from '../iconify';
import Scrollbar from '../scrollbar';
import ConfirmDialog from '../confirm-dialog';
import CustomBreadcrumbs from '../custom-breadcrumbs';
import { useSettingsContext } from '../settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../table';
// sections
import { InvoiceTableRow, InvoiceTableToolbar } from '../../sections/@dashboard/invoice/list';
import TransactionTableRow from 'src/sections/@dashboard/transactions/list/TransactionTableRow';
import AllTransactions from '@/components/transactions/all';
import useRouter from 'src/hooks/useRouter';
import NextLink from 'src/components/custom-link'

import { useQuery } from 'src/hooks/apollo';
import { GET_PAID_TRANSACTIONS, GET_SETTLED_TRANSACTIONS, GET_AUTHORIZED_TRANSACTIONS, GET_REFUNDED_TRANSACTIONS, GET_FAILED_TRANSACTIONS } from 'src/queries/transaction';

// ----------------------------------------------------------------------

const LatestTransactionsTable = ({ storeId, solutionId, settlementId, startDate, endDate }) => {

  const { push, hashParams } = useRouter();

  const merchantId = parseInt(hashParams.get('merchant'), 10);

  const [filterType, setFilterType] = useState(3);

  const handleFilterType = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    setFilterType(newValue);
  }

  const TABS = settlementId ? [
    { value: 3, label: 'Udbetalinger' },
    { value: 5, label: 'Tilbagebetalinger' },
  ] : [
    { value: 1, label: 'Autoriseringer' },
    { value: 2, label: 'Hævninger' },
    { value: 3, label: 'Udbetalinger' },
    { value: 4, label: 'Refunderinger' },
    { value: 5, label: 'Tilbagebetalinger' },
    { value: 'failing', label: 'Fejlende' },
  ] as const;

  const mainContent = (
    <>
      <Tabs
        value={filterType}
        onChange={handleFilterType}
        sx={{
          px: 2,
          bgcolor: 'background.neutral',
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
          />
        ))}
      </Tabs>
      <Divider />
      <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }}>
        <Grid item xs={12} sx={{ height: '75vh' }}>
          <AllTransactions merchantId={merchantId} storeId={storeId} solutionId={solutionId} settlementId={settlementId} startDate={startDate} endDate={endDate} type={filterType} />
        </Grid>
      </Grid>
    </>
  )

  return settlementId ? mainContent : (
    <Card>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2.5 }}>
        <CardHeader title="Seneste transaktioner" sx={{ p: 0 }} />
        <Button onClick={() => push(PATH_APP.payments.transactions.root)}>Se alle</Button>
      </Stack>
      {mainContent}
    </Card>
  )
}

// ----------------------------------------------------------------------

export default LatestTransactionsTable