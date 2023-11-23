import { useState, useEffect, useRef } from 'react'
import { Grid, Typography } from '@mui/material'
import AdvancedDateRangePicker from '../date-range-picker/AdvancedDateRangePicker'
import Iconify from '../iconify'
import { CustomSmallSelect } from '../custom-input'
import useDashboardFilterSettings from 'src/hooks/useDashboardFilterSettings'

import { useDispatch } from 'src/redux/store'
import { setDatePeriod, setSelectedStoreId } from 'src/redux/slices/dashboard'
import { useAuthContext } from 'src/auth/useAuthContext'

import dayjs from 'dayjs'

const DashboardTopBar = ({ subTitle }) => {
    const { stores, datePeriod, selectedStoreId, selectedDatePeriod } = useDashboardFilterSettings()
    const dispatch = useDispatch()
    const { session } = useAuthContext()
    const greetingIntervalCheckRef = useRef(null)
    const [ greeting, setGreeting ] = useState(dayjs().greet())
    useEffect(() => {
      greetingIntervalCheckRef.current = setInterval(() => {
        const newGreeting = dayjs().greet()
        if (greeting !== newGreeting) setGreeting(newGreeting)
      }, 60000)
      return () => clearInterval(greetingIntervalCheckRef.current)
    }, [ greeting ])
    return (
      <Grid item container xs={12} sx={{ pb: 1.5 }}>
        <Grid item xs={12} md={4}>
          <Typography variant="h4">
            {greeting}, <Typography sx={(theme) => ({ color: theme.palette.primary.main })} display="inline" variant="inherit">{session?.user?.firstname}!</Typography>
            <Iconify icon="emojione:waving-hand-light-skin-tone" sx={{ ml: 1 }} />
          </Typography>
          <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>{subTitle}</Typography>
        </Grid>
        <Grid item container xs={12} md={8} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
          <AdvancedDateRangePicker
            sx={{ mr: 1 }}
            value={[ datePeriod[0], datePeriod[1] ]}
            selectedPeriod={selectedDatePeriod}
            onDateChange={([start, end]) => dispatch(setDatePeriod({ period: 'custom', start, end: dayjs(end).hour(23).minute(59).second(59) }))}
            onPeriodChange={(e) => dispatch(setDatePeriod({ period: e.target.value }))}
          />
          <CustomSmallSelect
            value={selectedStoreId ?? null}
            onChange={(e) => dispatch(setSelectedStoreId(e.target.value))}
            options={Object.keys(stores).map((storeId) => ({ label: stores[storeId].name, value: storeId }))}
          />
        </Grid>
      </Grid>
    )
}

export default DashboardTopBar