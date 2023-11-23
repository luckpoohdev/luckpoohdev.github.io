// @mui
import { alpha } from '@mui/material/styles';
import { Card, CardHeader, Typography, Stack, LinearProgress, Box, CardProps } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  data: {
    status: string;
    quantity: number;
    value: number;
    color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
  }[];
}

export default function BookingBookedRoom({ title, subheader, data, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3} sx={{ px: 3, my: 5 }}>
        {data.map((progress, i) => (
          <LinearProgress
            variant="determinate"
            key={i}
            value={progress.value}
            color={progress.color ?? (
              (progress.status === 'Pending' && 'warning') ||
              (progress.status === 'Cancel' && 'error') ||
              'success'
            )}
            sx={{ height: 8, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16) }}
          />
        ))}
      </Stack>

      <Stack direction="row" justifyContent="space-between" sx={{ px: 3, pb: 3 }}>
        {data.map((progress, i) => (
          <Stack key={i} alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: progress.color ? `${progress.color}.main` : (
                    (progress.status === 'Pending' && 'warning.main') || 
                    (progress.status === 'Cancel' && 'error.main') || 
                    'success.main'
                  ),
                }}
              />

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {progress.status}
              </Typography>
            </Stack>

            <Typography variant="h6">{progress.quantity ? fShortenNumber(progress.quantity) : 0}</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}