// react
import * as React from 'react'
import { useState, useMemo, useId } from 'react'
// mui
import { Grid, Button } from '@mui/material';
// framer
import { m, AnimatePresence } from 'framer-motion';
// components
import Iconify from '../iconify/Iconify';

const MotionGrid = m(React.forwardRef(({ children, ...props }, ref) => (
    <Grid ref={ref} container item spacing={3.5} {...props}>
        {children}
    </Grid>
)))
  
const MotionIcon = m(React.forwardRef((props, ref) => <Iconify ref={ref} {...props} />))

const ElementLimiter = ({ children, Component = MotionGrid, componentProps = {}, maxVisible = 6, buttonProps = {} }) => {
    const childArray = useMemo(() => React.Children.toArray(children), [ children ])
    const visibleChildren = useMemo(() => childArray.slice(0, maxVisible), [ childArray ])
    const hiddenChildren = useMemo(() => childArray.length >= maxVisible ? childArray.slice(childArray, maxVisible) : [], [ childArray ])
    const [ open, setOpen ] = useState(false)
    const uid = useId()
    return (
        <>
            <Component {...componentProps}>
                {visibleChildren}
            </Component>
            <AnimatePresence mode="wait">
            {(open && childArray.length >= maxVisible) && (
                <Component
                    initial={{
                        height: 0,
                        opacity: 0,
                        overflow: 'hidden',
                    }}
                    animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                        height: {
                            duration: 0.4,
                        },
                        opacity: {
                            duration: 0.25,
                            delay: 0.15,
                        },
                        },
                        transitionEnd: {
                        overflow: 'visible',
                        },
                    }}
                    exit={{
                        height: 0,
                        opacity: 0,
                        overflow: 'hidden',
                        transition: {
                        height: {
                            duration: 0.4,
                        },
                        opacity: {
                            duration: 0.25,
                        },
                        },
                    }}
                    key={uid}
                    {...componentProps}
                >
                    {hiddenChildren}
                </Component>
            )}
            </AnimatePresence>
            {hiddenChildren.length ? (
                <Button
                    onClick={() => setOpen(!open)}
                    {...buttonProps}
                    sx={(theme) => ({
                        width: '100%',
                        justifyContent: 'space-between',
                        p: 1,
                        color: theme.palette.grey[800],
                        ...(buttonProps.sx ? (typeof buttonProps.sx === 'function' ? buttonProps.sx(theme) : buttonProps.sx) : {}),
                    })}
                >
                    <span>{open ? 'Vis færre' : 'Vis alle'}</span>
                    <MotionIcon icon="material-symbols:arrow-downward-rounded" animate={{ rotate: open ? 180 : 0 }} />
                </Button>
            ) : null}
        </>
    )
}

export default ElementLimiter