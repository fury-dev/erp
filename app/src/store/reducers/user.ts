import { User } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
const initialState: User = {
  email: '',
  username: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthUser: (_state, action) => {
      return {
        ...(action.payload || {})
      };
    }
  }
});

export const { setAuthUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
