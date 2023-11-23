// @mui
import { Box, Card, Rating, CardHeader, Typography, Stack, CardProps } from '@mui/material';
// utils
import { fCurrency, fShortenNumber } from 'src/utils/formatNumber';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import MoreActionsButton from 'src/components/more-actions-button';

import { useQuery } from 'src/hooks/apollo';
import { GET_INTEGRATIONS_LIST_WIDGET_DATA } from 'src/queries/widget';
import img from 'src/utils/img';

// ----------------------------------------------------------------------

export default function IntegrationsListWidget({ storeId }) {
  const { data, loading } = useQuery(GET_INTEGRATIONS_LIST_WIDGET_DATA, {
    variables: {
      storeId,
    }
  });
  return loading ? null : (
    <Card>
      <CardHeader title="Integrationer" />
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {data?.map((integrationItem) => (
            <IntegrationListItem key={integrationItem.id} integrationItem={integrationItem} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

function IntegrationListItem({ integrationItem }) {
  const {
    integration_name,
    integration_logo_url,
    integration_link_id,
    active,
    healthy,
    solution_name,
    solution_id,
    store_name,
    store_id,
    merchant_name,
    merchant_id,
  } = integrationItem;

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
        <Box component="img" src={img(integration_logo_url)} sx={{ width: 24, height: 24 }} />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
        <Stack direction="row">
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">{integration_name}</Typography>
            {(solution_name ?? store_name ?? merchant_name) && <Typography variant="body2">{solution_name ?? store_name ?? merchant_name}</Typography>}
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
              <Label variant="soft" color={!healthy ? 'error' : 'success'}>
                {healthy ? 'Aktiv' : 'Fejl'}
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
