// project imports

// action - state management
import { createSlice } from '@reduxjs/toolkit';
import config from '../../config';
import { TAccent, TCurrency } from '../../types';

export const initialState: {
  isOpen: string[];
  defaultId: string;
  fontFamily: string;
  borderRadius: number;
  opened: boolean;
  currency: TCurrency;
  accent: TAccent;
} = {
  isOpen: [], // for active default menu
  defaultId: 'default',
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  opened: true,
  currency: (localStorage.getItem('currency') as TCurrency) || 'INR',
  accent: (localStorage.getItem('accent') as TAccent) || 'LIGHT'
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
    saveAccent: (state, action) => {
      state.accent = action.payload;
      localStorage.setItem('accent', action.payload);
    },
    saveCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem('currency', action.payload);
    }
  }
});
export const { saveBorderRadius, setFontFamily, setIsOpen, setMenu, saveCurrency, saveAccent } = customization.actions;

export const customizationReducer = customization.reducer;
