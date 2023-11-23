// form
import { useController } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps } from '@mui/material';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export default function RHFTextField({ name, helperText, autoComplete, onChange, ...other }: Props) {
  const { field, fieldState: { error } } = useController({ name, defaultValue: '' });
  return (
    <TextField
      {...field}
      onChange={(...args) => {
        field.onChange(...args);
        if (typeof onChange === 'function') onChange(...args);
      }}
      fullWidth
      defaultValue=""
      value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
      error={!!error}
      helperText={error ? error?.message : helperText}
      {...other}
      inputProps={{ autocomplete: autoComplete }}
    />
  );
}
