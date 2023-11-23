import { Modal, Card } from '@mui/material'
import { m, AnimatePresence } from 'framer-motion'

const CustomBackdrop = styled(Backdrop, { name: 'MuiModal', slot: 'Backdrop', overridesResolver: (props, styles) => {
  return styles.backdrop
}, })(({ theme }) => ({ zIndex: -1, backgroundColor: alpha(theme.palette.background.paper, 0.9) }))

const Dialog = ({ children, ...props }) => {
  return (
    <Modal {...props}> 
      <AnimatePresence>
        {children && (
          <m.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}

export default Dialog