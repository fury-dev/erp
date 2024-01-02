import { useApiService } from '../../../../service';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setExpenses } from '../../../../store/reducers';
import { RootState } from '../../../../store';
import { useMultiSelect } from '../../../../context/MuliSelectContext';
import lodash from 'lodash';
import { Expense } from '../../../../types/items/expense';
export const useExpense = () => {
  const {
    add,
    update,
    remove: { deleteRequest },
    list: { data, loading, fetchMore, startPolling, updateQuery, stopPolling }
  } = useApiService('expense');
  const dispatch = useDispatch();
  const expense = useSelector((state: RootState) => state.expense.items);
  const [items, setItems] = useState(expense.value);
  const { selected } = useMultiSelect();

  const submitData = useCallback(
    (data: Expense) => {
      if (data?.id) {
        console.log('update', data);
        update.submitData(lodash.omit(lodash.omit(lodash.omit(lodash.omit(data, 'createdAt'), 'updatedAt'), 'expenseId'), 'pnl'));
      } else {
        console.log(data);
        add.submitData(lodash.omit(data, 'pnl'));
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
  }, [data]);
  const apiAction = useCallback(
    async (..._rest: any) => {
      startPolling(10000);
    },
    [data, startPolling]
  );

  return {
    submitData,
    list: { apiAction, data, loading, fetchMore, updateQuery, stopPolling },
    expense: items,
    selected,
    deleteRequest
  };
};
