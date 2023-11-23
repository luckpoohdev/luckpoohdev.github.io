import * as React from 'react'
// @mui
import {
  Button,
} from '@mui/material'
//
import Dialog from 'src/components/custom-dialog'
//
import { ConfirmDialogProps } from './types';

// ----------------------------------------------------------------------

export default function ConfirmDialog({
  title,
  children,
  action,
  open,
  onClose,
  cancelLabel = 'Annuller',
  cancelColor = 'primary',
  ...other
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          {action}
          <Button variant="contained" color={cancelColor} onClick={onClose}>{cancelLabel}</Button>
        </>
      }
      {...other}
    >
      {children}
    </Dialog>
  );
}
