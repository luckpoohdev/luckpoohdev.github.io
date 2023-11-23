import { forwardRef } from 'react';
// @mui
import { Box, Link, BoxProps } from '@mui/material';
import NextLink from 'src/components/custom-link'

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    
    const logo = (
      <Box
        component="img"
        src="/logo/logo_full.png"
        sx={{ width: '200px', height: 'auto', cursor: 'pointer', margin: '0 auto', mb: 2.5, ...sx }}
        {...other}
      />
    )

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={NextLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
