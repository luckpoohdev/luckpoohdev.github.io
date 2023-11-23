import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Box, Rating, LinearProgress, IconButton, Avatar, CircularProgress, Tabs, Tab, Divider, Link } from '@mui/material';
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
import { fDate } from 'src/utils/formatTime';
// components
import Label from 'src/components/label/Label';
import Iconify from 'src/components/iconify';
import { CustomAvatar } from 'src/components/custom-avatar';

import { useLocales } from 'src/locales';

import CountryFlag from 'src/components/country-flag';

import Icon from 'src/components/Icon';

import MoreActionsButton from 'src/components/more-actions-button';

import NextLink from 'src/components/custom-link';

import { GET_SETTLEMENT_TRANSACTIONS } from 'src/queries/settlement';
import { useQuery } from 'src/hooks/apollo';
import useRouter from 'src/hooks/useRoute'

import { alpha } from '@mui/material/styles';
import { PATH_APP } from 'src/routes/paths';


import getCardLogoUrl from '@/utils/getCardLogoUrl';

const generateColumns: (actions: Array<{ label: string, onClick: Function }>) => GridColDef[] = (actions) => [
  {
    field: 'id',
    hide: true,
  },
  {
    field: 'transacted_at',
    headerName: 'Dato',
    editable: false,
    renderCell: (params) => (
      <Typography variant="body2">
        {fDate(params.row.transacted_at)}
      </Typography>
    ),
  },
  {
    field: 'sale',
    headerName: 'Salg',
    editable: false,
    renderCell: (params) => (
      <Typography variant="body2">
        <Link component={NextLink} href={PATH_APP.payments.sales.view(params.row.sale)}>
        {params.row.sale}
        </Link>
      </Typography>
    ),
  },
  {
    field: 'card_type',
    headerName: 'Betalingskort',
    editable: false,
    flex: 1,
    renderCell: (params) => params.row.card_type && (
      <Typography variant="body2">
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
          <Avatar
            src={getCardLogoUrl(params.row.card_type)}
            sx={{
              backgroundColor: 'background.paper',
              '& .MuiAvatar-img': {
                objectFit: 'contain',
              },
            }}
          />
          <Box>{params.row.sub_brand.replace('_', ' ')}</Box>
        </Stack>
      </Typography>
    ),
  },
  {
    field: 'type',
    headerName: 'Type',
    editable: false,
    align: 'center',
    headerAlign: 'center',
    width: 120,
    renderCell: (params) => RenderType(params.row.type),
  },
  {
    field: 'status',
    headerName: 'Status',
    editable: false,
    align: 'center',
    headerAlign: 'center',
    width: 120,
    renderCell: (params) => RenderStatus(params.row.status_text),
  },
  {
    field: 'amount',
    headerName: 'Bruttobeløb',
    editable: false,
    align: 'center',
    headerAlign: 'center',
    width: 120,
    renderCell: (params) => fCurrency(params.row.amount/100),
  },
  {
    field: 'fee_amount',
    headerName: 'Gebyr',
    editable: false,
    align: 'center',
    headerAlign: 'center',
    width: 120,
    renderCell: (params) => params.row.type === 'payout' ? fCurrency(params.row.fee_amount/100) : <>&hellip;</>,
  },
  {
    field: 'net_amount',
    headerName: 'Nettobeløb',
    editable: false,
    align: 'center',
    headerAlign: 'center',
    width: 120,
    renderCell: (params) => fCurrency((params.row.amount - params.row.fee_amount)/100),
  },
  {
    field: 'bookkeeping_status',
    headerName: 'Bogført',
    editable: false,
    align: 'center',
    headerAlign: 'center',
    width: 120,
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

const TABS = [
  { value: 'payout', label: 'Salg' },
  { value: 'return', label: 'Refunderinger' },
] as const;


function CustomToolbar({ type, setType }) {
  return (
<>
<GridToolbarContainer sx={{ p: 0 }}>
      <Tabs
        value={type}
        onChange={(e, value) => {
          setType(value)
        }}
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
    </GridToolbarContainer>
    <Divider />
</>
  );
}

export default function Transactions({ settlementId, rowActions }: Props) {

  const [ page, setPage ] = useState(0)
  const [ pageSize, setPageSize ] = useState(25)

  const [ type, setType ] = useState('payout')

  const transactionQuery = useQuery(GET_SETTLEMENT_TRANSACTIONS, {
    variables: {
      settlementId,
      type,
      page,
      pageSize,
    },
  })

  const transactions = transactionQuery.data ?? []

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = useState(
    transactionQuery?.meta?.pagination?.total || 0,
  );
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
    transactionQuery?.meta?.pagination?.total !== undefined
        ? transactionQuery?.meta?.pagination?.total
        : prevRowCountState,
    );
  }, [transactionQuery?.meta?.pagination?.total, setRowCountState]);

  const { currentLang } = useLocales()
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const columns = generateColumns(rowActions)
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

  const selected = transactions?.filter((row) => selectionModel.includes(row.id));

  console.log('SELECTED', selected);

  return (
    <DataGridPro
      checkboxSelection
      autoHeight
      disableSelectionOnClick
      rows={transactions ?? []}
      rowCount={rowCountState}
      loading={transactionQuery.loading}
      columns={columns}
      rowsPerPageOptions={[5, 10, 25, 50, 100, 500]}
      pagination
      paginationMode="server"
      onPageChange={(newPage) => setPage(newPage)}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      pageSize={pageSize}
      page={page}
      localeText={currentLang.dataGrid}
      components={{
        Toolbar: CustomToolbar,
      }}
      componentsProps={{
        toolbar: {
          type,
          setType,
        },
      }}
      sx={(theme) => ({
        '& .MuiDataGrid-columnHeaders': {
          background: theme.palette.background.neutral,
          borderRadius: 0,
        },
      })}
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
      color={(getStatus === 'busy' && 'error') || (getStatus === 'away' && 'warning') || 'success'}
      sx={{ mx: 'auto' }}
    >
      {getStatus.replace('approved', 'godkendt')}
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
      color={(getType === 'refund' && 'error') || (getType === 'return' && 'warning') || (getType === 'payout' && 'success') || (getType === 'authorization' && 'info') || 'default'}
      sx={{ mx: 'auto' }}
    >
      {getType.replace('payout', 'udbetaling').replace('authorization', 'autorisering')}
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
