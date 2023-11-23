import { createSlice } from '@reduxjs/toolkit';

import dayjs from 'dayjs';

// ----------------------------------------------------------------------

const periodToStartAndEndDate = (period: string) => {
  switch (period) {
    case 'today': return [ dayjs().startOf('day'), dayjs().endOf('day') ]
    case 'yesterday': return [ dayjs().startOf('day').subtract(1, 'day'), dayjs().endOf('day').subtract(1, 'day') ]
    case 'last_7_days': return [ dayjs().startOf('day').subtract(6, 'day'), dayjs().endOf('day') ]
    case 'last_week': return [ dayjs().startOf('week').subtract(1, 'week'), dayjs().endOf('week').subtract(1, 'week') ]
    case 'last_30_days': return [ dayjs().startOf('day').subtract(29, 'day'), dayjs().endOf('day') ]
    case 'this_month': return [ dayjs().startOf('month'), dayjs().endOf('month') ]
    case 'last_month': return [ dayjs().startOf('month').subtract(1, 'month'), dayjs().endOf('month').subtract(1, 'month') ]
  }
}

const defaultDatePeriod = 'this_month'

const initialState = {
  selectedStoreId: 0,
  selectedDatePeriod: defaultDatePeriod,
  datePeriod: periodToStartAndEndDate(defaultDatePeriod),
};

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedStoreId: (state, action) => {
      state.selectedStoreId = action.payload
    },
    setDatePeriod: (state, action) => {
      state.selectedDatePeriod = action.payload.period
      if (action.payload.period === 'custom') {
        state.datePeriod = [ action.payload.start, action.payload.end ]
      } else {
        state.datePeriod = periodToStartAndEndDate(action.payload.period)
      }
    },
  },
});

// ----------------------------------------------------------------------

// Actions
export const { setSelectedStoreId, setDatePeriod } = slice.actions;

// Reducer
export default slice.reducer;
