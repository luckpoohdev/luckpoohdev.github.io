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
// sections
import AllSales from '@/components/sales/all';
import useRouter from 'src/hooks/useRouter';
import NextLink from 'src/components/custom-link'

// ----------------------------------------------------------------------

const TABS = [
  { value: 5, label: 'Gennemførte' },
  { value: 8, label: 'Fejlede' },
  { value: 7, label: 'Returnerede' },
] as const;

const LatestSalesTable = ({ storeId, startDate, endDate }) => {

  const { push, hashParams } = useRouter();

  const merchantId = parseInt(hashParams.get('merchant'), 10);

  const [filterStatus, setFilterStatus] = useState(5);

  const handleFilterStatus = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
    setFilterStatus(newValue);
  }

  return (
    <Card>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2.5 }}>
        <CardHeader title="Seneste salg" sx={{ p: 0 }} />
        <Button onClick={() => push(PATH_APP.payments.sales.root)}>Se alle</Button>
      </Stack>
      <Tabs
        value={filterStatus}
        onChange={handleFilterStatus}
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
        <AllSales merchantId={merchantId} storeId={storeId} startDate={startDate} endDate={endDate} status={filterStatus} />
      </Grid>
      </Grid>
    </Card>
  )
}

// ----------------------------------------------------------------------

export default LatestSalesTable