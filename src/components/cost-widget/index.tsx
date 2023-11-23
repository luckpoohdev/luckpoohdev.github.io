// @mui
import { Box, Card, Typography, Avatar, Stack } from '@mui/material';
// utils
import { fPercent, fCurrency } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------

export default function CostWidget({
  title,
  percent,
  total,
  amount,
  chart,
  currency,
  src,
  sx,
  ...other
}) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h3" gutterBottom>
          {currency ? fCurrency(total) : (amount ?? fPercent(total))}
        </Typography>
        <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
          <Typography variant="subtitle2" component="div" noWrap>
            <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
              {title}
            </Box>
          </Typography>
        </Stack>
      </Box>
      {src && <Avatar src={src} sx={{ width: 120, height: 120 }}/>}
    </Card>
  );
}