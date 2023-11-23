import { useState } from 'react';
// @mui
import {
  Link,
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
// utils
import { fDate, fDateTime } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
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

import img from 'src/utils/img';

import { TRANSACTION_STATUSES, TRANSACTION_STATUS_COLORS, TRANSACTION_TYPES, TRANSACTION_TYPE_COLORS } from 'src/config-global';
import getCardLogoUrl from '@/utils/getCardLogoUrl';

// ----------------------------------------------------------------------

type Props = {
  row: IInvoice;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function TransactionTableRow({
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

  const dataSourceLogoUrl = (() => {
    switch (row?.source_type) {
      case 'acquirer': return img(row.solution.acquiring_service_agreements?.find((agreement) => agreement.mid === row.mid)?.acquiring_service?.provider?.logo?.url) ?? null;
      case 'gateway': return img(row.solution.gateway_service_agreements?.find((agreement) => agreement.mid === row.mid)?.gateway_service?.provider?.logo?.url) ?? null;
      case 'terminal': return img(row.solution.terminal_service_agreements?.find((agreement) => agreement.mid === row.mid)?.terminal_service?.provider?.logo?.url) ?? null;
      default: return null;
    }
  })();

  const dataSourceName = (() => {
    switch (row?.source_type) {
      case 'acquirer': return row.solution.acquiring_service_agreements?.find((agreement) => agreement.mid === row.mid)?.acquiring_service?.provider?.name ?? null;
      case 'gateway': return row.solution.gateway_service_agreements?.find((agreement) => agreement.mid === row.mid)?.gateway_service?.provider?.name ?? null;
      case 'terminal': return row.solution.terminal_service_agreements?.find((agreement) => agreement.mid === row.mid)?.terminal_service?.provider?.name ?? null;
      default: return null;
    }
  })();

  return (
    <>
      <TableRow hover selected={selected} sx={(theme) => ({ borderBottom: `1px solid ${theme.palette.grey[300]}` })}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="right">{fCurrency(row.amount/100, row.currency)}</TableCell>

        <TableCell align="right">{fCurrency(row.fee_amount/100, row.fee_amount_currency)}</TableCell>

        <TableCell align="left">
          <Typography variant="body2">
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              <Avatar
                src={dataSourceLogoUrl}
                sx={{
                  backgroundColor: 'background.paper',
                  '& .MuiAvatar-img': {
                    objectFit: 'contain',
                    height: '80%',
                    width: '80%',
                  },
                }}
              />
              <Box>{dataSourceName}</Box>
            </Stack>
          </Typography>
        </TableCell>

        <TableCell align="center">
          {row?.payment_method?.indexOf('mobilepay') !== -1 ? (
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
            row?.transactions?.[0]?.card_type && (
              <Typography variant="body2">
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                  <Avatar
                    src={getCardLogoUrl(row.transactions?.[0].card_type)}
                    sx={{
                      backgroundColor: 'background.paper',
                      '& .MuiAvatar-img': {
                        objectFit: 'contain',
                      },
                    }}
                  />
                  <Box>{row.transactions?.[0].sub_brand.replace('_', ' ')}</Box>
                </Stack>
              </Typography>
          ))}
        </TableCell>

        <TableCell align="center">
        { RenderType(row.type)}
        </TableCell>

        <TableCell align="center">
          { RenderStatus(row.status_text)}
        </TableCell>

        <TableCell align="center">
          {RenderBookkeepingStatus(row.bookkeeping_status)}
        </TableCell>

        <TableCell align="left">
          {fDateTime(row.transacted_at)}
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={onViewRow}>
          <Iconify icon="eva:eye-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}


function RenderStatus(getStatus: string) {
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

function RenderType(type) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <Label
      variant={isLight ? 'soft' : 'filled'}
      color={TRANSACTION_TYPE_COLORS[type] ?? 'default'}
      sx={{ mx: 'auto' }}
    >
      {TRANSACTION_TYPES[type] ?? type}
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