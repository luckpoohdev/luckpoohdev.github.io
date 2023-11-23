import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { Stack, Typography, Box, Rating, LinearProgress, IconButton, Avatar, CircularProgress, TextField, InputAdornment } from '@mui/material';
import {
  DataGridPro,
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridSelectionModel,
  getGridNumericOperators,
  GridFilterInputValueProps,
} from '@mui/x-data-grid-pro';
// utils
import { fPercent, fCurrency } from 'src/utils/formatNumber';
import { fDate, fDatePeriod } from 'src/utils/formatTime';
import transformToGraphQLFilters from '@/utils/transformToGraphQLFilters';
// components
import Label from 'src/components/label/Label';
import Iconify from 'src/components/iconify';
import { CustomAvatar } from 'src/components/custom-avatar';

import { useLocales } from 'src/locales';

import CountryFlag from 'src/components/country-flag';

import Icon from 'src/components/Icon';

import MoreActionsButton from 'src/components/more-actions-button';

import { GET_SETTLEMENTS } from 'src/queries/settlement';
import { useQuery } from 'src/hooks/apollo';
import useRouter from 'src/hooks/useRouter';
import img from 'src/utils/img';
import { PATH_APP } from '@/routes/paths';

const generateColumns: (merchantId: any, actions: Array<{ label: string, onClick: Function }>) => GridColDef[] = (merchantId, actions) => [
  {
    field: 'id',
    hide: true,
    filterable: false,
  },
  {
    field: 'action',
    headerName: ' ',
    align: 'right',
    width: 32,
    hideable: false,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => <Link href={`${PATH_APP.payments.settlements.view(`${params.row.solution_id},${params.row.id}`)}#merchant=${merchantId}`}><IconButton><Iconify icon="eva:eye-fill" /></IconButton></Link>,
  },
  {
    field: 'period',
    headerName: 'Periode',
    flex: 1,
    type: 'date',
    editable: false,
    renderCell: (params) => (
      <Typography variant="body2">
        {fDatePeriod(params.row.period_start, params.row.period_end)}
      </Typography>
    ),
  },
  {
    field: 'sales_amount_sum',
    headerName: 'Salg',
    type: 'number',
    flex: 1,
    editable: false,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <Typography variant="body2">
        {fCurrency(params.row.sales_amount_sum, 'DKK')}
      </Typography>
    ),
  },
  {
    field: 'refund_amount_sum',
    headerName: 'Refunderinger',
    type: 'number',
    flex: 1,
    editable: false,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <Typography variant="body2">
        {fCurrency(params.row.refund_amount_sum, 'DKK')}
      </Typography>
    ),
  },
  {
    field: 'dispute_amount_sum',
    headerName: 'Indsigelser',
    type: 'number',
    flex: 1,
    editable: false,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <Typography variant="body2">
        {fCurrency(params.row.dispute_amount_sum, 'DKK')}
      </Typography>
    ),
  },
  {
    field: 'fee_amount_sum',
    headerName: 'Gebyrer',
    type: 'number',
    flex: 1,
    editable: false,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <Typography variant="body2">
        {fCurrency(params.row.fee_amount_sum, 'DKK')}
      </Typography>
    ),
  },
  {
    field: 'payout_amount',
    headerName: 'Udbetaling',
    type: 'number',
    flex: 1,
    editable: false,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <Typography variant="body2">
        {fCurrency(params.row.payout_amount, params.row.currency)}
      </Typography>
    ),
  },
  {
    field: 'balanced_status',
    headerName: 'Afstemt',
    type: 'boolean',
    width: 80,
    editable: false,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => RenderBalancedStatus(params.row.balanced_status),
  },
]

// ----------------------------------------------------------------------

type Props = {
  data: {
    id: string;
    name: string;
    email: string;
    lastLogin: Date;
    performance: number;
    rating: number;
    status: string;
    isAdmin: boolean;
    lastName: string;
    firstName: string;
    age: number;
  }[];
};

const SearchBar = () => {
  return (
    <TextField
      sx={{ width: '100%', mt: 3.5 }}
      placeholder="Søg..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="uil:search" />
          </InputAdornment>
        )
      }}
    />
  )
}

function CustomToolbar() {
  return (
    <>
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
    {/*<SearchBar />*/}
    </>
  );
}

export default function AllSettlements({ storeId, merchantId, solutionId, rowActions }: Props) {

  const staticFilters = {
    merchantId,
    storeId,
    solutionId,
  };

  const [ page, setPage ] = useState(0)
  const [ pageSize, setPageSize ] = useState(25)
  const settlements = useQuery(GET_SETTLEMENTS, {
    variables: {
      pageSize,
      page,
      ...staticFilters,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  function handleFilterChange(newFilterModel) {
    const graphqlFilters = transformToGraphQLFilters(newFilterModel);
    // Now use these filters with Apollo Client to fetch new data
    settlements.refetch({ filters: {
      and: [
        staticFilters,
        graphqlFilters
      ]
    } });
  }

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = useState(
    settlements?.meta?.pagination?.total || 0,
  );
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
    settlements?.meta?.pagination?.total !== undefined
        ? settlements?.meta?.pagination?.total
        : prevRowCountState,
    );
  }, [settlements?.meta?.pagination?.total, setRowCountState]);

  const { currentLang } = useLocales()
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const columns = generateColumns(merchantId, rowActions)
  if (columns.length > 0) {
    const ratingColumn = columns.find((column) => column.field === 'rating')!;
    const ratingColIndex = columns.findIndex((col) => col.field === 'rating');

    const ratingFilterOperators = getGridNumericOperators().map((operator) => ({
      ...operator,
      InputComponent: RatingInputValue,
    }));
    columns[ratingColIndex] = {
      ...ratingColumn,
      filterOperators: ratingFilterOperators,
    };
  }

  const selected = settlements?.data?.filter((row) => selectionModel.includes(row.id));

  console.log('SELECTED', selected);

  return (
    <DataGridPro
      disableSelectionOnClick
      rows={settlements.data ?? []}
      rowCount={rowCountState}
      loading={settlements.loading}
      columns={columns}
      rowsPerPageOptions={[5, 10, 25, 50, 100, 500]}
      pagination
      paginationMode="server"
      onPageChange={(newPage) => setPage(newPage)}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      onFilterModelChange={handleFilterChange}
      pageSize={pageSize}
      page={page}
      localeText={currentLang.dataGrid}
      components={{
        Toolbar: CustomToolbar,
      }}
      sx={{
        '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
           outline: 'none !important',
        },
      }}
    />
  )
}

// ----------------------------------------------------------------------

function RenderBalancedStatus(bookkeepingStatus: string) {
  return (
    bookkeepingStatus === 'success' && (<Icon name="ic_checkmark" color="success.main" width="24px" height="24px" />)
  ) || (
    bookkeepingStatus === 'failed' && (<Icon name="ic_alert" color="error.main" width="24px" height="24px" />)
  ) || (
    <Icon name="ic_clock" color="warning.main" width="24px" height="24px" />
  )
}

// ----------------------------------------------------------------------

function RatingInputValue({ item, applyValue }: GridFilterInputValueProps) {
  return (
    <Box sx={{ p: 1, height: 1, alignItems: 'flex-end', display: 'flex' }}>
      <Rating
        size="small"
        precision={0.5}
        placeholder="Filter value"
        value={Number(item.value)}
        onChange={(event, newValue) => {
          applyValue({ ...item, value: newValue });
        }}
      />
    </Box>
  );
}
