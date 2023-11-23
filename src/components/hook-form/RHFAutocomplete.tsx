// react
import { useMemo } from 'react'
// form
import { useController } from 'react-hook-form';
// @mui
import { Autocomplete, AutocompleteProps, TextField, Checkbox, Chip, Box, Typography, Stack } from '@mui/material';
import { darken, styled, lighten } from '@mui/system';

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

const renderStartIcon = (startIcon, option) => startIcon && (
  <Box component="span" sx={{ flexShrink: 0, mr: 1, fontSize: 22 }}>
    {typeof startIcon === 'function' ? startIcon(option) : startIcon}
  </Box>
)

const renderEndIcon = (endIcon, option) => endIcon && (
  <Box component="span" sx={{ flexShrink: 0, ml: 1, fontSize: 22 }}>
    {typeof endIcon === 'function' ? endIcon(option) : endIcon}
  </Box>
)

const renderStartIconAdornment = (startIcon, option) => startIcon && (
  <Box component="span" sx={{ flexShrink: 0, ml: 1, fontSize: 22 }}>
    {typeof startIcon === 'function' ? startIcon(option) : startIcon}
  </Box>
)

const renderEndIconAdornment = (endIcon, option) => endIcon && (
  <Box component="span" sx={{ flexShrink: 0, mr: 1, fontSize: 22 }}>
    {typeof endIcon === 'function' ? endIcon(option) : endIcon}
  </Box>
)

const GroupHeader = styled(Typography)(({ theme }) => ({
  padding: '4px 10px',
  color: theme.palette.grey[600],
  fontWeight: 'bold',
}));

const GroupItems = styled('ul')({
  padding: 0,
});

export default function RHFAutocomplete<
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
      openOnFocus
      value={selectedValue}
      multiple={multiple}
      onChange={(event, newValue) => field.onChange(multiple ? newValue?.map((option) => option[valueKey]) ?? null : newValue?.[valueKey] ?? null)}
      disableCloseOnSelect={multiple}
      getOptionLabel={(option) => option[labelKey] ?? ''}
      renderGroup={({ key, group, children }) => (
        <Box component="li" key={key}>
          <GroupHeader variant="body2">{group}</GroupHeader>
          <GroupItems>{children}</GroupItems>
        </Box>
      )}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderOption={(props, option, { selected }) => (
        <Box component="li" {...props} sx={{ px: option.groupBy ? '8px 8px 8px 32px !important' : '8px !important' }}>
          {multiple && (
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={field?.value && field?.value?.indexOf(option[valueKey]) !== -1}
            />
          )}
          {renderStartIcon(startIcon, option)}
          {option[labelKey]}
          {renderEndIcon(endIcon, option)}
        </Box>
      )}
      renderTags={multiple ? ((value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            size="large"
            label={(
              <Stack direction="row" alignItems="center">
                {renderStartIcon(startIcon, option)}
                {option[labelKey]}
                {renderEndIcon(endIcon, option)}
              </Stack>
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
            startAdornment: selectedValue && (
              <>
                {!multiple && renderStartIconAdornment(startIcon, selectedValue)}
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {!multiple && renderEndIconAdornment(endIcon, selectedValue)}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      options={options}
      {...other}
    />
  )
}
