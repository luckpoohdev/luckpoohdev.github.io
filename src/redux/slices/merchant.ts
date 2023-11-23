import { createSlice } from '@reduxjs/toolkit';
// @types
import { IMerchantType } from '../../@types/merchant';

// ----------------------------------------------------------------------

const initialState: IMerchantType = {
  userMerchants: [],
};

const slice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    setUserMerchants(state, action) {
      state.userMerchants = action.payload
    },
  },
});

// ----------------------------------------------------------------------

// Actions
export const { setUserMerchants } = slice.actions;

// Reducer
export default slice.reducer;
