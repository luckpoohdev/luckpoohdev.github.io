import { useState, useEffect } from 'react';
import Link from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Box, Rating, LinearProgress, IconButton, Avatar, CircularProgress, Select, MenuItem } from '@mui/material';
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
import { fDate, fDateTime } from 'src/utils/formatTime';
// components
import Label from 'src/components/label/Label';
import Iconify from 'src/components/iconify';
import { CustomAvatar } from 'src/components/custom-avatar';

import { useLocales } from 'src/locales';

import CountryFlag from 'src/components/country-flag';

import Icon from 'src/components/Icon';

import MoreActionsButton from 'src/components/more-actions-button';

import { GET_TRANSACTIONS } from 'src/queries/transaction';
import { useQuery } from 'src/hooks/apollo';
import useRouter from 'src/hooks/useRouter';
import img from 'src/utils/img';

import { TRANSACTION_TYPES, TRANSACTION_STATUSES } from 'src/config-global';
import getCardLogoUrl from '@/utils/getCardLogoUrl';
import transformToGraphQLFilters from '@/utils/transformToGraphQLFilters';
import { PATH_APP } from '@/routes/paths';

const transactionTypes = [
  { value: '0', label: 'Initialisering' },
  { value: '1', label: 'Autorisering' },
  { value: '2', label: 'Hævning' },
  { value: '3', label: 'Udbetaling' },
  { value: '4', label: 'Refundering' },
  { value: '5', label: 'Tilbagebetaling' },
];

function TransactionTypeSelect(props) {
  const { item, applyValue, ...other } = props;

  const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    applyValue({ ...item, value: event.target.value as string });
  };


  return (
    <Select
      value={item.value}
      onChange={handleFilterChange}
      {...other}
    >
      {transactionTypes.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

const transactionStatuses = [
  { value: '0', label: 'Gennemført' },
  { value: '1', label: 'Annulleret' },
  { value: '2', label: 'Fejlet' },
];

function TransactionStatusSelect(props) {
  const { item, applyValue, ...other } = props;

  const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    applyValue({ ...item, value: event.target.value as string });
  };


  return (
    <Select
      value={item.value}
      onChange={handleFilterChange}
      {...other}
    >
      {transactionStatuses.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

const generateColumns: (merchantId: any, storeId: any, actions: Array<{ label: string, onClick: Function }>) => GridColDef[] = (merchantId, storeId, actions) => [
  {
    field: 'action',
    headerName: ' ',
    align: 'right',
    width: 32,
    hideable: false,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => <Link href={`${PATH_APP.payments.transactions.view(`${params.row.solution_id},${params.row.id}`)}#merchant=${merchantId}`}><IconButton><Iconify icon="eva:eye-fill" /></IconButton></Link>,
  },
  {
    field: 'sale_id',
    headerName: 'Ordrenummer',
    editable: false,
    headerAlign: 'right',
    width: 125,
    type: 'string',
    align: 'right',
    renderCell: (params) => (
      <Typography variant="body2">
        {params.row.sale_id ? <Link href={`${PATH_APP.payments.sales.view(`${params.row.store_id},${params.row.sale_id}`)}#merchant=${merchantId}`}>{params.row.sale_id}</Link> : null}
      </Typography>
    ),
  },
  {
    field: 'amount',
    headerName: 'Beløb',
    editable: false,
    type: 'number',
    headerAlign: 'right',
    align: 'right',
    renderCell: (params) => (
      <Typography variant="body2">
        {fCurrency(params.row.amount, 'DKK')}
      </Typography>
    ),
  },
  {
    field: 'fee_amount',
    headerName: 'Gebyr',
    editable: false,
    headerAlign: 'right',
    type: 'number',
    align: 'right',
    renderCell: (params) => (
      <Typography variant="body2">
        {params.row.fee_amount && (params.row.type === 'payout' || params.row.source_type !== 'acquirer') ? fCurrency(params.row.fee_amount, 'DKK') : <>&hellip;</>}
      </Typography>
    ),
  },
  {
    field: 'transacted_at',
    headerName: 'Processeret',
    editable: false,
    align: 'left',
    type: 'dateTime',
    headerAlign: 'left',
    width: 140,
    filterable: !storeId,
    renderCell: (params) => fDateTime(params.row.transacted_at),
  },
  {
    field: 'integration_name',
    headerName: 'Datakilde',
    editable: false,
    type: 'string',
    flex: 1,
    valueGetter: (params) => params.row.integration_name,
    renderCell: (params) => {
      const sourceLogoUrl = img(params.row.integration_logo_url);
      const sourceLabel = params.row.integration_name;
      return (
        <Typography variant="body2">
          {sourceLogoUrl && (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <Avatar
                src={sourceLogoUrl}
                sx={{
                  backgroundColor: 'background.paper',
                  '& .MuiAvatar-img': {
                    objectFit: 'contain',
                  },
                }}
              />
              <Box>{sourceLabel}</Box>
            </Stack>
          )}
        </Typography>
      )
    },
  },
  {
    field: 'payment_method',
    headerName: 'Betalingsform',
    editable: false,
    type: 'string',
    flex: 1,
    valueGetter: (params) => params.row.payment_method,
    renderCell: (params) => (
      params.row?.payment_method?.indexOf('mobilepay') !== -1 ? (
        <Typography variant="body2">
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Avatar
              src={'https://dev.api.advisoa.dk/uploads/mobilepay_235aaa708b.svg?updated_at=2023-01-03T14:32:32.710Z'}
              sx={{
                backgroundColor: 'background.paper',
                '& .MuiAvatar-img': {
                  objectFit: 'contain',
                  height: '80%',
                  width: '80%',
                },
              }}
            />
            <Box>MobilePay Online</Box>
          </Stack>
        </Typography>
      ) : (
        params.row?.card_type && (
          <Typography variant="body2">
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <Avatar
                src={getCardLogoUrl(params.row.card_type)}
                sx={{
                  backgroundColor: 'background.paper',
                  '& .MuiAvatar-img': {
                    objectFit: 'contain',
                    height: '80%',
                    width: '80%',
                  },
                }}
              />
              <Box>{params.row.sub_brand.replace('_', ' ')}</Box>
            </Stack>
          </Typography>
        )
      )
    ),
  },
  {
    field: 'type',
    headerName: 'Type',
    editable: false,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    width: 120,
    valueOptions: transactionTypes,
    filterOperators: [{
      label: 'er',
      value: '=',
      getApplyFilterFn: (filterItem, column) => {
        if (!filterItem.field || !filterItem.value || !filterItem.operator) {
          return null;
        }
    
        return (params: GridCellParams): boolean => {
          return params.value === filterItem.value;
        };
      },
      InputComponent: TransactionTypeSelect, // Your custom dropdown input component with prefixed labels
    }, {
      label: 'er ikke',
      value: '!=',
      getApplyFilterFn: (filterItem, column) => {
        if (!filterItem.field || !filterItem.value || !filterItem.operator) {
          return null;
        }
    
        return (params: GridCellParams): boolean => {
          return params.value === filterItem.value;
        };
      },
      InputComponent: TransactionTypeSelect, // Your custom dropdown input component with prefixed labels
    }],  // Use your custom filter operator
    filterable: !storeId,
    renderCell: (params) => RenderType(params.row.type),
  },
  {
    field: 'status',
    headerName: 'Status',
    editable: false,
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    width: 120,
    valueOptions: transactionStatuses,
    filterOperators: [{
      label: 'er',
      value: '=',
      getApplyFilterFn: (filterItem, column) => {
        if (!filterItem.field || !filterItem.value || !filterItem.operator) {
          return null;
        }
    
        return (params: GridCellParams): boolean => {
          return params.value === filterItem.value;
        };
      },
      InputComponent: TransactionStatusSelect, // Your custom dropdown input component with prefixed labels
    }, {
      label: 'er ikke',
      value: '!=',
      getApplyFilterFn: (filterItem, column) => {
        if (!filterItem.field || !filterItem.value || !filterItem.operator) {
          return null;
        }
    
        return (params: GridCellParams): boolean => {
          return params.value === filterItem.value;
        };
      },
      InputComponent: TransactionStatusSelect, // Your custom dropdown input component with prefixed labels
    }],  // Use your custom filter operator
    filterable: !storeId,
    renderCell: (params) => RenderStatus(params.row.status),
  },
  {
    field: 'bookkeeping_status',
    headerName: 'Bogført',
    editable: false,
    align: 'center',
    type: 'boolean',
    headerAlign: 'center',
    width: 120,
    renderCell: (params) => params.row.status === 'cancelled' || params.row.status === 'authorized' ? <>&hellip;</> : RenderBookkeepingStatus(params.row.bookkeeping_status),
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

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function AllTransactions({ sort = 'desc', storeId, merchantId, solutionId, settlementId, saleId, rowActions, startDate, endDate, type }: Props) {

  const staticFilters = {
    merchantId,
    storeId,
    solutionId,
    saleId,
    settlementId,
  };
  const baseFilters = { and: [{
    status: {
      eq: type !== 'failing' ? 0 : 2,
    },
  }] };
  if (startDate) baseFilters.and.push({
    transacted_at: {
      dateGte: startDate,
    },
  });
  if (endDate) baseFilters.and.push({
    transacted_at: {
      dateLte: endDate,
    },
  });
  if (type !== 'failing') baseFilters.and.push({
    type: {
      eq: type,
    },
  });
  
  const [ page, setPage ] = useState(0)
  const [ pageSize, setPageSize ] = useState(25)
  const [ graphqlFilters, setGraphqlFilters ] = useState(baseFilters);
  const transactions = useQuery(GET_TRANSACTIONS, {
    variables: {
      pageSize,
      page,
      sort,
      ...staticFilters,
      filters: graphqlFilters,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = useState(
    transactions?.meta?.pagination?.total || 0,
  );
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
    transactions?.meta?.pagination?.total !== undefined
        ? transactions?.meta?.pagination?.total
        : prevRowCountState,
    );
  }, [transactions?.meta?.pagination?.total, setRowCountState]);

  useEffect(() => {
    setGraphqlFilters({
      ...graphqlFilters,
      ...baseFilters,
    })
  }, [ JSON.stringify(baseFilters) ]);

  const { currentLang } = useLocales()
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const columns = generateColumns(merchantId, storeId, rowActions)
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

  const selected = transactions?.data?.filter((row) => selectionModel.includes(row.id));

  console.log('SELECTED', selected);

  function handleFilterChange(newFilterModel) {
    const graphqlFilters = {
      ...transformToGraphQLFilters(newFilterModel),
      ...baseFilters,
    };
    setGraphqlFilters(graphqlFilters);
  }

  return (
    <DataGridPro
      disableSelectionOnClick
      rows={transactions.data ?? []}
      rowCount={rowCountState}
      loading={transactions.loading}
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

function RenderStatus(getStatus: string) {
  const status = String(getStatus)
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <Label
      variant={isLight ? 'soft' : 'filled'}
      color={(status === 'failed' && 'error') || (status === 'cancelled' && 'default') || 'success'}
      sx={{ mx: 'auto' }}
    >
      {TRANSACTION_STATUSES[getStatus]}
    </Label>
  );
}

// ----------------------------------------------------------------------

function RenderType(getType: string) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <Label
      variant={isLight ? 'soft' : 'filled'}
      color={(getType === 'refund' && 'error') || (getType === 'return' && 'warning') || (getType === 'payout' && 'success') || (getType === 'settlement' && 'primary') || (getType === 'authorization' && 'info') || 'default'}
      sx={{ mx: 'auto' }}
    >
      {TRANSACTION_TYPES[getType]}
    </Label>
  );
}

// ----------------------------------------------------------------------

function RenderBookkeepingStatus(bookkeepingStatus: string) {
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
