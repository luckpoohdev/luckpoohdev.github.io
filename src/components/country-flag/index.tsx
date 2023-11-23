import { Box } from '@mui/material'

const CountryFlag = ({ code, sx, ...props }) => {
    return (
        <Box
            component="span"
            className={`fi fi-${String(code).toLowerCase()}`}
            sx={(theme) => ({
                fontSize: '1.25rem',
                borderRadius: '4px',
                ...(typeof sx === 'function' ? sx(theme) : sx),
            })}
            {...props}
        />
    )
}

export default CountryFlag