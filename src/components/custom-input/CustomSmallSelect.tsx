import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { alpha } from '@mui/material';

const CustomSmallSelect = React.forwardRef(({ value, defaultValue, options = [], onChange, sx, ...props }, ref) => (
  <Select
    value={value ?? defaultValue}
    ref={ref}
    onChange={onChange}
    sx={(theme) => ({
      backgroundColor: alpha(theme.palette.grey[500], 0.08),
      outline: 'none',
      border: 'none',
      boxShadow: 'none',
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.body2.fontSize,
      height: '36px',
      '& .MuiOutlinedInput-notchedOutline': {
        border: '0',
      },
      ...(typeof sx === 'function' ? sx(theme) : sx),
    })}
    {...props}
  >
    {options.map((option, index) => <MenuItem value={option.value} key={index} index={index}>{option.label}</MenuItem>)}
  </Select>
))

export default CustomSmallSelect