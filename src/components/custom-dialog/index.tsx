import * as React from 'react'
import { m, AnimatePresence } from 'framer-motion'
import {
    Dialog as DialogBase,
    CardHeader,
    CardContent,
    CardActions,
    Card,
    Backdrop,
} from '@mui/material'
import styled from '@emotion/styled'
import { alpha, useTheme } from '@mui/system'

const CustomBackdrop = styled(Backdrop, { name: 'MuiModal', slot: 'Backdrop', overridesResolver: (props, styles) => {
    return styles.backdrop
}, })(({ theme }) => ({ zIndex: -1, backgroundColor: alpha(theme.palette.background.paper, 0.9) }))

const MotionCard = m(Card)

const Dialog = ({ children, title, actions, open, maxWidth = "sm", onClose, ...props }) => {
  const theme = useTheme()
  return (
    <DialogBase
      open={open}
      onClose={onClose}
      fullWidth
      PaperComponent={React.Fragment}
      slots={{
        backdrop: CustomBackdrop,
      }}
      {...props}
    >
      <AnimatePresence>
        {children && (
          <MotionCard
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
              width: theme.breakpoints.values[maxWidth] ?? maxWidth,
            }}
          >
            <CardHeader title={title} />
            <CardContent>
              {children}
            </CardContent>
            <CardActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end' }}>
              {actions}
            </CardActions>
          </MotionCard>
        )}
      </AnimatePresence>
    </DialogBase>
  )
}

export default Dialog