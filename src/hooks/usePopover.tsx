import * as React from 'react'
import { useRef, useState, useMemo, useEffect } from 'react'
import { Menu } from '@mui/material'

import getPosition from 'src/components/menu-popover/getPosition'
import { StyledArrow } from 'src/components/menu-popover/styles'

const usePopover = (ref?: React.RefObject<React.ReactElement>) => {
    const [ open, setOpen ] = useState(false)
    const popoverRef = ref ?? useRef(null)
    const EnhancedPopover = useMemo(() => ({
        children,
        control,
        arrow = 'top-right',
        disabledArrow = false,
        ...props
    }) => {
        const [ mounted, setMounted ] = useState(false)
        const { style, anchorOrigin, transformOrigin } = getPosition(arrow)
        const Control = useMemo(() => React.cloneElement(control, { ref: popoverRef, onClick: () => setOpen(true) }), [])
        const enhancedChildren = useMemo(() => React.Children.map(children, (child) => React.cloneElement(child, {
            onClick: (e) => {
                setOpen(false)
                if (typeof child.props.onClick === 'function') child.props.onClick(e)
            }
        })), [ children ])
        useEffect(() => {
            if (!mounted) setMounted(true)
        }, [])
        return (
            <>
                {Control}
                <Menu
                    open={open}
                    anchorEl={popoverRef.current}
                    transformOrigin={transformOrigin}
                    anchorOrigin={anchorOrigin}
                    onClose={(e) => setOpen(false)}
                    {...props}
                >
                    {!disabledArrow && <StyledArrow arrow={arrow} />}
                    {enhancedChildren}
                </Menu>
            </>
        )
    }, [ open ])
    return {
        Component: EnhancedPopover,
        setOpen,
        open,
        ref: popoverRef,
    }
}

export default usePopover