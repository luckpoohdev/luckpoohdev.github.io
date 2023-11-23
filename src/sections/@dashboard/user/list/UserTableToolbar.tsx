// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

type Props = {
  filterKeywords: string;
  filterRole: string;
  isFiltered: boolean;
  optionsRole: string[];
  onResetFilter: VoidFunction;
  onKeywordsChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeywordsBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function UserTableToolbar({
  isFiltered,
  filterKeywords,
  filterRole,
  optionsRole,
  onKeywordsChange,
  onKeywordsBlur,
  onRoleChange,
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
        select
        label="Rolle"
        value={filterRole}
        onChange={onRoleChange}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 260,
              },
            },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsRole.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>

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
