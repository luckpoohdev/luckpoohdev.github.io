import { useState } from 'react';
// @mui
import {
  Checkbox,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
// components
import MoreActionsButton from 'src/components/more-actions-button';

import { PATH_APP } from 'src/routes/paths';

import useConfirmDialog from 'src/hooks/useConfirmDialog';
import useRouter from 'src/hooks/useRouter';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function RoleTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const {
    id,
    name,
    description,
    assigned_user_count,
    locked,
  } = row;

  const router = useRouter()

  const viewRole = (id) => router.push(PATH_APP.organization.roles.view(id))
  const editRole = (id) => router.push(PATH_APP.organization.roles.edit(id))

  const [ deleteRole, ConfirmDeleteRoleDialog ] = useConfirmDialog({
    onConfirm: (id) => null,
  })

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          {!locked && <Checkbox checked={selected} onClick={onSelectRow} />}
        </TableCell>

        <TableCell>
            {name}
        </TableCell>

        <TableCell>
              {description}
        </TableCell>

        <TableCell>
              {assigned_user_count}
        </TableCell>

        <TableCell align="right">
          <MoreActionsButton
            actions={[{
              label: 'Vis',
              icon: 'ic_eye',
              onClick: () => viewRole(id),
            }].concat(locked ? [] : [
              {
                label: 'Rediger',
                icon: 'ic_edit',
                onClick: () => editRole(id),
              }, {
                label: 'Slet',
                icon: 'ic_trash',
                onClick: () => deleteRole(id),
              },
            ])}
          />
        </TableCell>
      </TableRow>
      
      <ConfirmDeleteRoleDialog
        title="Slet rolle?"
        content={(
          <>
            <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette denne rolle?</Typography>
            <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
          </>
        )}
        confirmLabel="Slet"
        confirmColor="error"
      />
    </>
  );
}
