// @mui
import { Box, Card, Rating, CardHeader, Typography, Stack, CardProps } from '@mui/material';
// utils
import { fCurrency, fShortenNumber } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import MoreActionsButton from 'src/components/more-actions-button';

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  name: string;
  system: string;
  price: number;
  rating: number;
  review: number;
  shortcut: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: ItemProps[];
}

export default function AppTopRelated({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((app) => (
            <ApplicationItem key={app.id} app={app} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ApplicationItemProps = {
  app: ItemProps;
};

function ApplicationItem({ app }: ApplicationItemProps) {
  const { shortcut, status, name, subheader } = app;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.neutral',
        }}
      >
        <Box component="img" src={shortcut} sx={{ width: 24, height: 24 }} />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
        <Stack direction="row">
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">{name}</Typography>
            {subheader && <Typography variant="body2">{subheader}</Typography>}
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
              <Label variant="soft" color={status === 'fejl' ? 'error' : 'success'}>
                {status}
              </Label>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Stack alignItems="flex-end" sx={{ pr: 3 }}>
        <MoreActionsButton actions={[
          { label: 'Fjern', onClick: () => alert('Under udvikling') }
        ]} />
      </Stack>
    </Stack>
  );
}
