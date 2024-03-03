import { createSlice } from '@reduxjs/toolkit';
import { current, produce } from 'immer';
import { Expense } from '../../types/items/expense';
const initialState: {
  setup: Expense;
  items: {
    page: number;
    value: Expense[];
  };
  view: Expense;
  versions: Expense[];
} = {
  setup: {
    id: '',
    versionId: 1,
    note: '',
    operationType: 'CREDIT',
    expenseType: 'OTHERS',

    amount: {
      currency: 'INR',
      amount: 0
    },
    cashInBank: {
      currency: 'INR',
      amount: 0
    },
    cashInHand: {
      currency: 'INR',
      amount: 0
    },
    pnl: {
      currency: 'INR',
      amount: 0
    },
    createdAt: '',
    updatedAt: ''
  },
  view: {
    id: '',
    versionId: 1,
    note: '',
    operationType: 'CREDIT',
    expenseType: 'OTHERS',
    amount: {
      currency: 'INR',
      amount: 0
    },
    cashInBank: {
      currency: 'INR',
      amount: 0
    },
    cashInHand: {
      currency: 'INR',
      amount: 0
    },
    pnl: {
      currency: 'INR',
      amount: 0
    },
    createdAt: '',
    updatedAt: ''
  },
  items: {
    page: 0,
    value: []
  },
  versions: []
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setExpenses: (_state, action) => {
      return {
        ...current(_state),
        items: action.payload
      };
    },
    setExpense: (_state, action) => {
      return produce(_state, (draft) => {
        draft.setup = action.payload;
      });
    },
    setExpenseView: (_state, action) => {
      return {
        ...current(_state),
        view: action.payload
      };
    }
  }
});

export const { setExpense, setExpenses, setExpenseView } = expenseSlice.actions;

export const expenseReducer = expenseSlice.reducer;
