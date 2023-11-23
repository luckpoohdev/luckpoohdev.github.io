import * as React from 'react'
import { useState, useMemo, useEffect } from 'react'
import usePopover from 'src/hooks/usePopover';
import { m, AnimatePresence } from 'framer-motion'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {
    Typography,
    Stack,
    Box,
} from '@mui/material';

const SelectArrow = m(ExpandMoreRoundedIcon)

const SelectBase = ({ children, placeholder, valuePrefix, onChange, sx, ...props }) => {
    const [ mounted, setMounted ] = useState(false)
    const Popover = usePopover()
    const [ value, setValue ] = useState(props.value ?? null)
    const handleChange = (newValue) => {
        if (typeof onChange === 'function') onChange(newValue)
        setValue(newValue)
    }
    const childArray = React.Children.toArray(children)
    const selectedChild = useMemo(() => childArray.find((child) => child.props.value === value), [ value ])
    useEffect(() => {
        setMounted(true)
    }, [])
    return (
        <>
        <Popover.Component arrow="top-left" control={(
            <Stack direction="row" justifyContent="space-between" sx={{ cursor: 'pointer', px: 2, py: 1 }}>
                {selectedChild ? (
                    <Stack direction="row">
                        {valuePrefix && <Box sx={{ mr: 1 }}>{valuePrefix}</Box>}
                        <Typography variant="body1">{selectedChild.props.children}</Typography>
                    </Stack>
                ) : (
                    <Typography variant="body1" color="text.disabled">{placeholder}</Typography>
                )}
                <AnimatePresence>
                    <SelectArrow
                        key="arrow"
                        sx={{ color: 'text.disabled' }}
                        initial={{ rotate: !mounted || Popover.open ? 0 : 180 }}
                        animate={{ rotate: Popover.open ? 180 : 0 }}
                        transition={{
                            ease: 'easeInOut',
                            duration: 0.2,
                        }}
                    />
                </AnimatePresence>
            </Stack>
        )}>
          {childArray.map((child) => React.cloneElement(child, {
            onClick: () => handleChange(child.props.value),
            selected: child.props.value === value,
          }))}
        </Popover.Component>
        </>
    )
}

export default SelectBase