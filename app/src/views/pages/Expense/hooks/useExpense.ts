import { useApiService } from '../../../../service';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setExpenses } from '../../../../store/reducers';
import { RootState } from '../../../../store';
import lodash from 'lodash';
import { Expense } from '../../../../types/items/expense';
import { useMultiSelect } from '../../../../context/useMultiSelect';
export const useExpense = () => {
  const {
    add,
    update,
    remove: { deleteRequest },
    list: { data, loading, fetchMore, startPolling, updateQuery, stopPolling }
  } = useApiService<Expense>('expense');
  const dispatch = useDispatch();
  const expense = useSelector((state: RootState) => state.expense.items);
  const [items, setItems] = useState(expense.value);
  const { selected } = useMultiSelect();

  const submitData = useCallback(
    async (data: Expense) => {
      if (data?.id) {
        await update.submitData(lodash.omit(lodash.omit(lodash.omit(lodash.omit(data, 'createdAt'), 'updatedAt'), 'expenseId'), 'pnl'));
      } else {
        await add.submitData(lodash.omit(data, 'pnl'));
      }
    },
    [update, add]
  );

  useEffect(() => {
    if (data?.expenses) {
      dispatch(
        setExpenses({
          value: data.expenses,
          page: 1
        })
      );
      setItems(data.expenses);
    }
  }, [data, dispatch]);
  const apiAction = useCallback(
    async (..._rest: any) => {
      startPolling(10000);
    },
    [startPolling]
  );

  return {
    submitData,
    list: { apiAction, data, loading, fetchMore, updateQuery, stopPolling },
    expense: items,
    selected,
    deleteRequest
  };
};
