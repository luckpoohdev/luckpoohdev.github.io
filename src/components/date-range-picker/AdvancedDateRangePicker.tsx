import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { PickersActionBar } from '@mui/x-date-pickers/PickersActionBar';
import { Button } from '@mui/material';
import { alpha } from '@mui/material';

import { CustomSmallSelect } from '../custom-input';
import { Popover } from '@mui/material';
import { useWidth } from 'src/hooks/useResponsive';

import { fDateRange } from 'src/utils/formatTime'

export default function AdvancedDateRangePicker({ value, selectedPeriod, onDateChange, onPeriodChange, sx, ...props }) {
    const [ showDatePicker, setShowDatePicker ] = React.useState(false)
    const popoverHandleRef = React.useRef(null)
    const handleDateChange = ([ start, end ]) => {
        if (start && end && typeof onDateChange === 'function') onDateChange([ start, end ])
    }
    const breakpoints = useWidth()
    const mobile = ['xs', 's', 'sm'].indexOf(breakpoints) !== -1
    const calendar = React.useMemo(() => {
        return (
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
            >
                <StaticDateRangePicker
                    displayStaticWrapperAs={mobile ? 'mobile' : 'desktop'}
                    showToolbar={false}
                    value={value}
                    components={{
                        ActionBar: PickersActionBar,
                    }}
                    componentsProps={{
                        actionBar: { actions: [] },
                    }}
                    onChange={handleDateChange}
                    {...props}
                />
            </LocalizationProvider>
        )
    }, [ JSON.stringify(value), mobile ])
    return  (
        <>
            <Button
                ref={popoverHandleRef}
                onClick={() => setShowDatePicker(true)}
                sx={(theme) => ({
                    borderRadius: `${Number(theme.shape.borderRadius) * 0.75} !important`,
                    backgroundColor: alpha(theme.palette.grey[500], 0.08),
                    color: theme.palette.text.primary,
                    height: '36px',
                    ...(typeof sx === 'function' ? sx(theme) : sx),
                })}
            >{fDateRange(value[0], value[1])}</Button>
            <Popover
                anchorEl={popoverHandleRef.current}
                open={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                anchorOrigin={{
                    vertical: 48,
                    horizontal: 'left',
                }}
            >
                <CustomSmallSelect
                    options={[
                        { label: 'I dag', value: 'today' },
                        { label: 'I går', value: 'yesterday' },
                        { label: 'Seneste 7 dage', value: 'last_7_days' },
                        { label: 'Forrige uge', value: 'last_week' },
                        { label: 'Seneste 30 dage', value: 'last_30_days' },
                        { label: 'Denne måned', value: 'this_month' },
                        { label: 'Forrige måned', value: 'last_month' },
                        { label: 'Tilpasset', value: 'custom' },
                    ]}
                    onChange={onPeriodChange}
                    value={selectedPeriod}
                    sx={{ borderRadius: 0, border: 0 }}
                />
                {calendar}
                <Button sx={{ borderRadius: 0, width: '100%', borderTop: 1, borderWidth: 2, borderColor: 'rgba(145, 158, 171, 0.24)' }} onClick={(e) => setShowDatePicker(false)}>Luk</Button>
            </Popover>
        </>
    )
}