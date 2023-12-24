import { createSlice } from '@reduxjs/toolkit';
import { produce } from 'immer';
import { Expense } from '../../types/items/expense';
const initialState: {
  setup: Expense;
  items: {
    page: number;
    value: Expense[];
  };
  view: Expense;
} = {
  setup: {
    id: '',
    expenseType: '',
    versionId: '',

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
    versionId: '',

    expenseType: '',
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
  }
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setExpenses: (_state, action) => {
      return produce(_state, (draft) => {
        draft.items.value = action.payload;
      });
    },
    setExpense: (_state, action) => {
      return produce(_state, (draft) => {
        draft.setup = action.payload;
      });
    },
    setExpenseView: (_state, action) => {
      return produce(_state, (draft) => {
        draft.view = action.payload;
      });
    }
  }
});

export const { setExpense, setExpenses, setExpenseView } = expenseSlice.actions;

export const expenseReducer = expenseSlice.reducer;
