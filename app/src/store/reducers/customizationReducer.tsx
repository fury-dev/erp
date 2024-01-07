// project imports

// action - state management
import { createSlice } from '@reduxjs/toolkit';
import config from '../../config';
import { TCurrency } from '../../types';

export const initialState: {
  isOpen: string[];
  defaultId: string;
  fontFamily: string;
  borderRadius: number;
  opened: boolean;
  currency: TCurrency;
} = {
  isOpen: [], // for active default menu
  defaultId: 'default',
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  opened: true,
  currency: (localStorage.getItem('currency') as TCurrency) || 'INR'
};

const customization = createSlice({
  name: 'customization',
  initialState,
  reducers: {
    setIsOpen: (state, action) => {
      state.isOpen = [action.payload.id];
    },
    setMenu: (state, action) => {
      state.opened = action.payload.opened;
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload.fontFamily;
    },
    saveBorderRadius: (state, action) => {
      state.borderRadius = action.payload.borderRadius;
    },
    saveCurrency: (state, action) => {
      state.currency = action.payload.currency;
      localStorage.setItem('currency', action.payload.currency);
    }
  }
});
export const { saveBorderRadius, setFontFamily, setIsOpen, setMenu, saveCurrency } = customization.actions;

export const customizationReducer = customization.reducer;
