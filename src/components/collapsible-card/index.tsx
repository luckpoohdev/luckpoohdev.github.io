import * as React from 'react'
import { useState } from 'react'
import {
    Card,
    CardHeader,
    Stack,
    Collapse,
    CardActionArea,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { m } from 'framer-motion'

const MExpandMoreIcon = m(ExpandMoreIcon)

const CollapsibleCard = ({ children, defaultCollapsed = true, unmountOnExit = true, sx, ...props }) => {
    const [ collapsed, setCollapsed ] = useState(defaultCollapsed)
    let header = null
    const content = []
    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) return
        if (child.type === CardHeader) {
            header = child
        } else {
            content.push(child)
        }
    })
    return (
        <Card
            sx={(theme) => ({
                '& .MuiCardContent-root': {
                    pt: 0,
                },
                '& .MuiCardHeader-root': {
                    pb: 3,
                },
                ...(typeof sx === 'function' ? sx(theme) : sx),
            })}
            {...props}
        >
            <CardActionArea>
                {React.cloneElement(header, {
                    ...header.props,
                    title: (
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            {header.props.title}
                            <MExpandMoreIcon animate={{ rotate: !collapsed ? 180 : 0 }} />
                        </Stack>
                    ),
                    onClick: () => setCollapsed((collapsed) => !collapsed ),
                    'aria-expanded': !collapsed,
                    'aria-label': collapsed ? 'vis mere' : 'vis mindre',
                })}
            </CardActionArea>

            <Collapse in={!collapsed} timeout="auto" unmountOnExit={unmountOnExit}>
                {content}
            </Collapse>
        </Card>
    )
}

export default CollapsibleCard