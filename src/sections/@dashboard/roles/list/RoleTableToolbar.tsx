// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

type Props = {
  filterKeywords: string;
  isFiltered: boolean;
  onResetFilter: VoidFunction;
  onKeywordsChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeywordsBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function RoleTableToolbar({
  isFiltered,
  filterKeywords,
  onKeywordsChange,
  onKeywordsBlur,
  onResetFilter,
}: Props) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >

      <TextField
        fullWidth
        value={filterKeywords}
        onChange={onKeywordsChange}
        onBlur={onKeywordsBlur}
        placeholder="Søg..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Ryd
        </Button>
      )}
    </Stack>
  );
}
