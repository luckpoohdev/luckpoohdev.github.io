// react
import { useMemo } from 'react'
// form
import { useController } from 'react-hook-form';
// @mui
import { Autocomplete, AutocompleteProps, TextField, Checkbox, Chip, Box } from '@mui/material';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// ----------------------------------------------------------------------

interface Props<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
  name: string;
  label?: string;
  helperText?: React.ReactNode;
}

export default function RHFAutoCheck<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  name,
  label,
  placeholder,
  helperText,
  value,
  defaultValue,
  options,
  startIcon,
  endIcon,
  valueKey = 'value',
  labelKey = 'label',
  required,
  multiple,
  ...other
}: Omit<Props<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'>) {
  const { field, fieldState } = name ? useController({ name, defaultValue: null }) : { value: value ?? defaultValue }
  const selectedValue = useMemo(() => multiple ? (
    options?.filter((option) => field.value && field.value.indexOf(option[valueKey]) !== -1) ?? null
  ) : (
    options?.find((option) => field.value === option[valueKey]) ?? null
  ), [ JSON.stringify(field.value) ])
  return (
    <Autocomplete
      {...field}
      value={selectedValue}
      multiple={multiple}
      onChange={(event, newValue) => field.onChange(multiple ? newValue?.map((option) => option[valueKey]) ?? null : newValue?.[valueKey] ?? null)}
      disableCloseOnSelect={multiple}
      getOptionLabel={(option) => option[labelKey] ?? ''}
      renderOption={(props, option, { selected }) => (
        <Box component="li" {...props} sx={{ px: '8px !important' }}>
          {multiple && (
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
          )}
          {startIcon}
          {option[labelKey]}
          {endIcon}
        </Box>
      )}
      renderTags={multiple ? ((value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={(
              <>
                {startIcon}
                {option[labelKey]}
                {endIcon}
              </>
            )}
            {...getTagProps({ index })}
          />
        ))
      ) : null}
      renderInput={(params) => (
        <TextField
          {...params}
          label={multiple && required && field?.value?.length ? `${label} *` : label}
          placeholder={placeholder}
          helperText={fieldState?.error?.message ?? helperText}
          error={!!fieldState.error}
          required={(!multiple && required) || (multiple && required && !field?.value?.length)}
          inputProps={multiple ? params.inputProps : {
            ...params.inputProps,
            value: selectedValue?.[labelKey] ?? '',
          }}
          InputProps={ multiple ? params.InputProps : {
            ...params.InputProps,
            value: selectedValue?.[labelKey] ?? '',
          }}
        />
      )}
      options={options}
      {...other}
    />
  )
}
