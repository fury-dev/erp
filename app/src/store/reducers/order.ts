import { createSlice } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { Order } from '../../types/items/order';
const initialState: {
  setup: Order;
  items: {
    page: number;
    value: Order[];
  };
  view: Order;
} = {
  setup: {
    id: '',
    customerName: '',
    versionId: '',
    orderDate: '',
    orderType: '',
    amount: {
      currency: 'INR',
      amount: 0
    },
    productId: '',
    product: undefined,
    status: '',
    paymentStatus: false,
    deliveryDate: '',
    createdAt: '',
    updatedAt: ''
  },
  items: {
    page: 0,
    value: []
  },
  view: {
    id: '',
    versionId: '',
    customerName: '',
    orderDate: '',
    orderType: '',
    amount: {
      currency: 'INR',
      amount: 0
    },
    productId: '',
    product: undefined,
    status: '',
    paymentStatus: false,
    deliveryDate: '',
    createdAt: '',
    updatedAt: ''
  }
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (_state, action) => {
      return produce(_state, (draft) => {
        draft.items.value = action.payload;
      });
    },
    setOrder: (_state, action) => {
      return produce(_state, (draft) => {
        draft.setup = action.payload;
      });
    },
    setOrderView: (_state, action) => {
      return produce(_state, (draft) => {
        draft.view = action.payload;
      });
    }
  }
});

export const { setOrder, setOrders, setOrderView } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
