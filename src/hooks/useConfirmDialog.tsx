import { useState, useMemo, useRef } from 'react'
import { Button } from '@mui/material'

import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog'

const useConfirmDialog = ({ onConfirm, onCancel }) => {
    const [ open, setOpen ] = useState(false)
    const callbackArgs = useRef(null)
    const Dialog = useMemo(() => {
        return ({ children, confirmColor = 'primary', confirmLabel = 'Fortsæt', cancelLabel = 'Annuller', cancelColor = 'primary', ...props }) => {
            return (
                <ConfirmDialog
                    open={open}
                    onClose={(e) => {
                        setOpen(false)
                        if (typeof onCancel === 'function') onCancel(e)
                    }}
                    action={<Button variant="outlined" color={confirmColor} onClick={(e) => {
                        setOpen(false)
                        if (typeof onConfirm === 'function') onConfirm(...callbackArgs.current)
                    }}>{confirmLabel}</Button>}
                    cancelColor={cancelColor}
                    cancelLabel={cancelLabel}
                    {...props}
                >{children}</ConfirmDialog>
            )
        }
    }, [ open ])
    return [
        (...args) => {
            callbackArgs.current = args
            setOpen(true)
        },
        Dialog,
    ]
}

export default useConfirmDialog