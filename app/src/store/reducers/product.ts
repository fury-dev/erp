import { createSlice } from '@reduxjs/toolkit';
import { current, produce } from 'immer';
import { Product } from '../../types/items/product';
const initialState: {
  setup: Product;
  items: {
    page: number;
    value: Product[];
  };
  view: Product;
} = {
  setup: {
    id: '',
    versionId: 1,
    distributorPrice: {
      currency: 'INR',
      amount: 0
    },
    sellerPrice: {
      currency: 'INR',
      amount: 0
    },
    size: [],
    createdAt: '',
    updatedAt: '',
    name: '',
    image: undefined,
    inStock: false
  },
  items: {
    page: 0,
    value: []
  },
  view: {
    id: '',
    distributorPrice: {
      currency: 'INR',
      amount: 0
    },
    sellerPrice: {
      currency: 'INR',
      amount: 0
    },
    size: [],
    createdAt: '',
    updatedAt: '',
    name: '',
    image: '',
    inStock: false,
    versionId: 1
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (_state, action) => {
      return {
        ...current(_state),
        items: action.payload
      };
    },
    setProduct: (_state, action) => {
      return produce(_state, (draft) => {
        draft.setup = action.payload;
      });
    },
    setProductView: (_state, action) => {
      return produce(_state, (draft) => {
        draft.view = action.payload;
      });
    }
  }
});

export const { setProduct, setProducts, setProductView } = productSlice.actions;

export const productReducer = productSlice.reducer;
