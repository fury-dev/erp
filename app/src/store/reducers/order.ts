import { createSlice } from '@reduxjs/toolkit';
import { current, produce } from 'immer';
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
    versionId: 1,
    orderDate: '',
    orderType: 'CASH_ON_DELIVERY',
    amount: {
      currency: 'INR',
      amount: 0
    },
    location: {
      address: '',
      city: '',
      country: '',
      pincode: 0,
      state: ''
    },
    productId: '',
    product: undefined,
    status: 'PENDING',
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
    versionId: 1,
    customerName: '',
    orderDate: '',
    orderType: 'CASH_ON_DELIVERY',
    amount: {
      currency: 'INR',
      amount: 0
    },
    location: {
      address: '',
      city: '',
      country: '',
      pincode: 0,
      state: ''
    },
    productId: '',
    product: undefined,
    status: 'PENDING',
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
      return {
        ...current(_state),
        items: action.payload
      };
    },
    setOrder: (_state, action) => {
      return produce(_state, (draft) => {
        draft.setup = action.payload;
      });
    },
    setOrderView: (_state, action) => {
      return {
        ...current(_state),
        view: action.payload
      };
    }
  }
});

export const { setOrder, setOrders, setOrderView } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
