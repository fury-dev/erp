// project imports

// action - state management
import { createSlice } from '@reduxjs/toolkit';
import config from '../../config';

export const initialState: {
  isOpen: string[];
  defaultId: string;
  fontFamily: string;
  borderRadius: number;
  opened: boolean;
} = {
  isOpen: [], // for active default menu
  defaultId: 'default',
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  opened: true
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
    }
  }
});
export const { saveBorderRadius, setFontFamily, setIsOpen, setMenu } = customization.actions;

export const customizationReducer = customization.reducer;
