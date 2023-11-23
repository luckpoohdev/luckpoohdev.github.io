import { useState } from 'react';
// @mui
import {
  Stack,
  Button,
  Divider,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  Box,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
// utils
import { fDate, fDateTime } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
import RenderCard from '@/utils/renderCard';
// @types
import { IInvoice } from '../../../../@types/invoice';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import { CustomAvatar } from '../../../../components/custom-avatar';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import CountryFlag from 'src/components/country-flag';

import Icon from 'src/components/Icon';

import { SALE_STATUSES, SALE_STATUS_COLORS, TRANSACTION_STATUSES, TRANSACTION_STATUS_COLORS } from 'src/config-global';

// ----------------------------------------------------------------------

type Props = {
  row: IInvoice;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

const statuses = {
  'completed': 'Udbetalt',
  'reserved': 'Reserveret',
  'failed': 'Fejlet',
  'returned': 'Returneret',
}

import { PATH_APP } from '@/routes/paths';
import getCardLogoUrl from '@/utils/getCardLogoUrl';

export default function SaleTableRow({
  merchantId,
  storeId,
  row,
  selected,
  onSelectRow,
  onViewRow,
  onDeleteRow,
}: Props) {

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected} sx={(theme) => ({ borderBottom: `1px solid ${theme.palette.grey[300]}` })}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="right">
          <Link href={`${PATH_APP.payments.sales.view(row.id)}#merchant=${merchantId}`}>{row.id}</Link>
        </TableCell>

        <TableCell align="right">{fCurrency(row.sum_total_amount, 'DKK')}</TableCell>

        <TableCell align="left">{row.solution_name}</TableCell>

        <TableCell align="left">
          {row?.payment_method?.indexOf('mobilepay') !== -1 ? (
              <Typography variant="body2">
              <Stack direction="row" alignItems="center" justifyContent="left" spacing={2}>
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
            row.card_type && (
              <Typography variant="body2">
                <Stack direction="row" alignItems="center" justifyContent="left" spacing={2}>
                  <Avatar
                    src={getCardLogoUrl(row.card_type)}
                    sx={{
                      backgroundColor: 'background.paper',
                      '& .MuiAvatar-img': {
                        objectFit: 'contain',
                        height: '80%',
                        width: '80%',
                      },
                    }}
                  />
                  <Box>{RenderCard(row.card_type, row.card_sub_brand)}</Box>
                </Stack>
              </Typography>
          ))}
        </TableCell>

        <TableCell align="center">
          <CountryFlag code={row.region} />
        </TableCell>

        <TableCell align="center">
          { RenderStatus(row.status_text)}
        </TableCell>

        <TableCell align="center">
          { RenderPaymentStatus(row.latest_payment_status_text)}
        </TableCell>

        <TableCell align="center">
          {RenderBookkeepingStatus(row.bookkeeping_status)}
        </TableCell>

        <TableCell align="left">
          {fDateTime(row.placed_at)}
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          Vis
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Slet
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Slet"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Slet
          </Button>
        }
      >
        Er du sikker på at du gerne vil slette dette salg? Denne handling kan ikke fortrydes og kan potentielt skabe uoverensstemmelser i dine data!
      </ConfirmDialog>
    </>
  );
}


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
      color={TRANSACTION_STATUS_COLORS[getStatus] ?? 'default'}
      sx={{ mx: 'auto' }}
    >
      {TRANSACTION_STATUSES[getStatus] ?? getStatus}
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