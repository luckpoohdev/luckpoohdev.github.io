import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Box, Rating, LinearProgress, IconButton, Avatar, CircularProgress, Select, MenuItem  } from '@mui/material';
import {
  DataGridPro,
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridSelectionModel,
  GridFilterOperator,
  GridCellParams,
  getGridNumericOperators,
  GridFilterInputValueProps,
} from '@mui/x-data-grid-pro';
import { unstable_debounce as debounce } from '@mui/utils';
import Link from 'next/link';
// utils
import { fPercent, fCurrency } from 'src/utils/formatNumber';
import { fDate, fDateTime } from 'src/utils/formatTime';
import RenderCard from '@/utils/renderCard';
// components
import Label from 'src/components/label/Label';
import Iconify from 'src/components/iconify';
import { CustomAvatar } from 'src/components/custom-avatar';

import { useLocales } from 'src/locales';

import CountryFlag from 'src/components/country-flag';

import Icon from 'src/components/Icon';

import MoreActionsButton from 'src/components/more-actions-button';

import { GET_SALES } from 'src/queries/sale';
import { useQuery } from 'src/hooks/apollo';
import useRouter from 'src/hooks/useRouter';

import { SALE_STATUSES, SALE_STATUS_COLORS, TRANSACTION_TYPES, TRANSACTION_TYPE_COLORS } from 'src/config-global';

import { PATH_APP } from '@/routes/paths';
import transformToGraphQLFilters from '@/utils/transformToGraphQLFilters';
import getCardLogoUrl from '@/utils/getCardLogoUrl';

const orderStatuses = [
  { value: '0', label: 'Forudbestilt' },
  { value: '1', label: 'Kladde' },
  { value: '2', label: 'Afventer' },
  { value: '3', label: 'Bearbejder' },
  { value: '4', label: 'Pauset' },
  { value: '5', label: 'Gennemført' },
  { value: '6', label: 'Annulleret' },
  { value: '7', label: 'Refunderet' },
  { value: '8', label: 'Fejlet' },
];

function OrderStatusSelect(props) {
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
      {orderStatuses.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

const paymentStatuses = [
  { value: '0', label: 'Initialiseret' },
  { value: '1', label: 'Autoriseret' },
  { value: '2', label: 'Hævet' },
  { value: '3', label: 'Udbetalt' },
  { value: '4', label: 'Refunderet' },
  { value: '5', label: 'Tilbagebetalt' },
];

function PaymentStatusSelect(props) {
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
      {paymentStatuses.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

const generateColumns: (merchantId: any, storeId: any, actions: Array<{ label: string, onClick: Function }>) => GridColDef[] = (merchantId, storeId, actions) => [
  {
    field: 'id',
    headerName: 'Ordrenummer',
    editable: false,
    type: 'string',  
    width: 125,
    renderCell: (params) => (
      <Typography variant="body2" noWrap>
        <Link href={`${PATH_APP.payments.sales.view(`${params.row.store_id},${params.row.id}`)}#merchant=${merchantId}`}>{params.row.id}</Link>
      </Typography>
    ),
  },
  {
    field: 'sum_total_amount',
    headerName: 'Beløb',
    editable: false,
    type: 'number',
    renderCell: (params) => (
      <Typography variant="body2">
        {fCurrency(params.row.sum_total_amount, params.row.currency)}
      </Typography>
    ),
  },
  {
    field: 'placed_at',
    headerName: 'Oprettet',
    filterable: !storeId,
    editable: false,
    align: 'center',
    type: 'dateTime',
    headerAlign: 'center',
    width: 140,
    renderCell: (params) => fDateTime(params.row.placed_at),
  },
  {
    field: 'solution_name',
    headerName: 'Løsning',
    editable: false,
    type: 'string',
    flex: 1,
    renderCell: (params) => (
      <Typography variant="body2">
        {params.row.solution_name}
      </Typography>
    ),
  },
  {
    field: 'latest_settlement_payment_method',
    headerName: 'Betalingsform',
    editable: false,
    type: 'string',
    flex: 1,
    renderCell: (params) => params?.row?.latest_settlement_payment_method?.indexOf('mobilepay') !== -1 ? (
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
    params?.row?.latest_settlement_card_type && (
      <Typography variant="body2">
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
          <Avatar
            src={getCardLogoUrl(params?.row?.latest_settlement_card_type)}
            sx={{
              backgroundColor: 'background.paper',
              '& .MuiAvatar-img': {
                objectFit: 'contain',
                height: '80%',
                width: '80%',
              },
            }}
          />
          <Box>{RenderCard(params?.row?.latest_settlement_card_type, params?.row?.latest_settlement_sub_brand)}</Box>
        </Stack>
      </Typography>
  )),
  },
  {
    field: 'region',
    headerName: 'Land',
    editable: false,
    type: 'string',
    renderCell: (params) => <CountryFlag code={params.row.region} />,
  },
  {
    field: 'status',
    headerName: 'Ordrestatus',
    type: 'number',
    filterable: !storeId,
    valueOptions: orderStatuses,
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
      InputComponent: OrderStatusSelect, // Your custom dropdown input component with prefixed labels
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
      InputComponent: OrderStatusSelect, // Your custom dropdown input component with prefixed labels
    }],  // Use your custom filter operator
    editable: false,
    align: 'center',
    headerAlign: 'center',
    width: 120,
    renderCell: (params) => RenderStatus(params.row.status),
  },
  {
    field: 'latest_payment_status',
    headerName: 'Betalingsstatus',
    type: 'number',
    valueOptions: paymentStatuses,
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
      InputComponent: PaymentStatusSelect, // Your custom dropdown input component with prefixed labels
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
      InputComponent: PaymentStatusSelect, // Your custom dropdown input component with prefixed labels
    }],  // Use your custom filter operator
    editable: false,
    align: 'center',
    headerAlign: 'center',
    width: 120,
    renderCell: (params) => RenderPaymentStatus(params.row.latest_payment_status),
  },
  {
    field: 'bookkeeping_status',
    headerName: 'Bogført',
    editable: false,
    align: 'center',
    headerAlign: 'center',
    width: 120,
    type: 'boolean',
    renderCell: (params) => RenderBookkeepingStatus(params.row.bookkeeping_status),
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

export default function AllSales({ storeId, merchantId, solutionId, rowActions, startDate, endDate, status }: Props) {

  const staticFilters = {
    merchantId,
    storeId,
    solutionId,
  };

  const baseFilters = { and: [] };
  if (status !== undefined && status !== null) {
    baseFilters.and.push({
      status: {
        eq: status,
      },
    });
  }
  if (startDate) baseFilters.and.push({
    placed_at: {
      dateGte: startDate,
    },
  });
  if (endDate) baseFilters.and.push({
    placed_at: {
      dateLte: endDate,
    },
  });

  const [ page, setPage ] = useState(0)
  const [ pageSize, setPageSize ] = useState(25);
  const [ graphqlFilters, setGraphqlFilters ] = useState(baseFilters);
  const sales = useQuery(GET_SALES, {
    variables: {
      pageSize,
      page,
      ...staticFilters,
      filters: graphqlFilters,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = useState(
    sales?.meta?.pagination?.total || 0,
  );
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
    sales?.meta?.pagination?.total !== undefined
        ? sales?.meta?.pagination?.total
        : prevRowCountState,
    );
  }, [sales?.meta?.pagination?.total, setRowCountState]);

  useEffect(() => {
    setGraphqlFilters({
      ...graphqlFilters,
      ...baseFilters,
    })
  }, [ JSON.stringify(baseFilters) ]);
  
  const { currentLang } = useLocales()
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const columns = generateColumns(merchantId, storeId, rowActions)

  const selected = sales?.data?.filter((row) => selectionModel.includes(row.id));


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
      rows={sales.data ?? []}
      rowCount={rowCountState}
      loading={sales.loading}
      columns={columns}
      rowsPerPageOptions={[5, 10, 25, 50, 100, 500]}
      pagination
      paginationMode="server"
      onFilterModelChange={handleFilterChange}
      onPageChange={(newPage) => setPage(newPage)}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <Label
      variant={isLight ? 'soft' : 'filled'}
      color={SALE_STATUS_COLORS[getStatus] ?? 'default'}
      sx={{ mx: 'auto' }}
    >
      {SALE_STATUSES[getStatus] ?? getStatus}
    </Label>
  );
}

function RenderPaymentStatus(getStatus: string) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <Label
      variant={isLight ? 'soft' : 'filled'}
      color={TRANSACTION_TYPE_COLORS[getStatus] ?? 'default'}
      sx={{ mx: 'auto' }}
    >
      {TRANSACTION_TYPES[getStatus] ?? 'Ubetalt'}
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
