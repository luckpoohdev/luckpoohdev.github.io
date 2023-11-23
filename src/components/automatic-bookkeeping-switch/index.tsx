import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useWatch, useFormState } from 'react-hook-form';
import { Stack, CircularProgress, Typography } from '@mui/material';
import { RHFSwitch } from 'src/components/hook-form';

import useRouter from 'src/hooks/useRouter';

import { TOGGLE_MERCHANT_AUTOMATIC_BOOKKEEPING } from 'src/queries/accounting';

const AutomaticBookkeepingSwitch = ({ storeId, merchantId, solutionId }) => {
  const [ toggleMerchantAutomaticBookkeeping, merchantAutomaticBookkeeping ] = useMutation(TOGGLE_MERCHANT_AUTOMATIC_BOOKKEEPING);
  const isAutomaticBookkeepingActive = !!useWatch({ name: 'automatic_bookkeeping' });
  const isStoreSpecificBookkeepingActive = !!useWatch({ name: 'store_specific_bookkeeping' });
  const router = useRouter();  
  const formState = useFormState();
  const [ saving, setSaving ] = useState(false);
  useEffect(() => {
    const save = async () => {
      if (formState?.touchedFields?.automatic_bookkeeping) {
        setSaving(true);
        await toggleMerchantAutomaticBookkeeping({
          variables: {
            merchantId,
            storeId,
            solutionId,
            active: isAutomaticBookkeepingActive,
          }
        });
        setSaving(false);
      }
    };
    save();
  }, [ isAutomaticBookkeepingActive, formState?.touchedFields?.automatic_bookkeeping ]);
  return saving ? (
    <Stack direction="row" alignItems="center" spacing={1.37} sx={{ height: '38px', pl: 2 }}>
      <CircularProgress sx={{ width: '20px !important', height: '20px !important' }} />
      <Typography variant="body2">Aktiver automatisk bogføring{storeId ? ' for salgssted' : ''}{solutionId ? ' for løsning' : ''}</Typography>
    </Stack>
  ) : (
    <RHFSwitch name="automatic_bookkeeping" label={`Aktiver automatisk bogføring${storeId ? ' for salgssted' : ''}${solutionId ? ' for løsning' : ''}`} />
  );
}

export default AutomaticBookkeepingSwitch;