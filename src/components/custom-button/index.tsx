import * as React from 'react'
import { Button } from '@mui/material';
import { alpha } from '@mui/material';

const CustomButton = React.forwardRef(({ sx, children, icon, iconPlacement = 'right', ...props }, ref) => (
    <Button
        ref={ref}
        sx={(theme) => ({
            borderRadius: `${Number(theme.shape.borderRadius) * 0.75} !important`,
            backgroundColor: alpha(theme.palette.grey[500], 0.08),
            color: theme.palette.text.primary,
            height: '36px',
            textTransform: 'unset',
            ...(typeof sx === 'function' ? sx(theme) : sx),
        })}
        {...props}
    >
        {(icon && iconPlacement === 'left') && React.cloneElement(icon, { sx: { mr: 1 } })}
        {children}
        {(icon && iconPlacement === 'right') && React.cloneElement(icon, { sx: { ml: 1 } })}
    </Button>
))

export default CustomButton