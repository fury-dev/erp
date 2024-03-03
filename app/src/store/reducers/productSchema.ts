import { createSlice } from '@reduxjs/toolkit';
import { current, produce } from 'immer';
import { ProductSchema } from '../../types/items/product';
const initialState: {
  setup: ProductSchema;
  items: {
    page: number;
    value: ProductSchema[];
  };
  view: ProductSchema;
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
    inStock: false,
    versionId: 1
  }
};

const productSchemaSlice = createSlice({
  name: 'productSchemas',
  initialState,
  reducers: {
    setProductSchemas: (_state, action) => {
      return {
        ...current(_state),
        items: action.payload
      };
    },
    setProductSchema: (_state, action) => {
      return produce(_state, (draft) => {
        draft.setup = action.payload;
      });
    },
    setProductSchemaView: (_state, action) => {
      return {
        ...current(_state),
        view: action.payload
      };
    }
  }
});

export const { setProductSchema, setProductSchemas, setProductSchemaView } = productSchemaSlice.actions;

export const productSchemaReducer = productSchemaSlice.reducer;
