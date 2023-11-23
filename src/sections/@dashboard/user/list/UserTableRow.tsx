import { useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// @types
import { IUserAccountGeneral } from '../../../../@types/user';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';

import useConfirmDialog from 'src/hooks/useConfirmDialog';
import MoreActionsButton from 'src/components/more-actions-button';
import useRouter from 'src/hooks/useRouter';
import { PATH_APP } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
  row: IUserAccountGeneral;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const {
    id,
    avatarUrl,
    name,
    team,
    role,
    verified,
    status,
  } = row;

  const router = useRouter()

  const [ deleteUser, ConfirmDeleteUserDialog ] = useConfirmDialog({
    onConfirm: (id) => null,
  })

  const editUser = (id) => router.push(PATH_APP.organization.users.edit(id))

  const viewUser = (id) => router.push(PATH_APP.organization.users.view(id))

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />

            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{team}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {role === 'user' ? 'bruger' : role}
        </TableCell>

        <TableCell align="center">
          <Iconify
            icon={verified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
            sx={{
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!verified && { color: 'warning.main' }),
            }}
          />
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={(status === 'deactivated' && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status === 'deactivated' ? 'deaktiveret' : 'aktiv'}
          </Label>
        </TableCell>
        
        <TableCell align="right">
          <MoreActionsButton
            actions={[{
              label: (
                <>
                  <Iconify icon="mdi:show" />
                  Vis
                </>
              ),
              onClick: () => viewUser(id),
            }, {
              label: (
                <>
                  <Iconify icon="eva:edit-fill" />
                  Rediger
                </>
              ),
              onClick: () => editUser(id),
            }, {
              label: (
                <>
                  <Iconify icon="eva:trash-2-outline" />
                  Slet
                </>
              ),
              onClick: () => deleteUser(id),
            }]}
          />
        </TableCell>
      </TableRow>
      
      <ConfirmDeleteUserDialog
        title="Slet bruger?"
        confirmLabel="Slet"
        confirmColor="error"
      >
        <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette denne bruger?</Typography>
        <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
      </ConfirmDeleteUserDialog>
    </>
  );
}
