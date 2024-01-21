import { useEffect, useState } from 'react';
import { ITEMS } from '../../types/items';
import { useList } from '.';
import { useDispatch } from 'react-redux';
import { setExpenseView, setOrderView, setProductView } from '../../store/reducers';

export const useFind = <T>(_item: ITEMS) => {
  const { data, error, ...rest } = useList(_item);
  const [item, setItem] = useState<T>();
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) console.error('API error', error);

    if (data)
      setItem(() => {
        let item = data[`${_item}s`][0];
        if (_item === 'expense') {
          dispatch(setExpenseView(item));
        } else if (_item === 'order') {
          dispatch(setOrderView(item));
        } else {
          dispatch(setProductView(item));
        }
        return item;
      });
  }, [error, data]);

  return {
    ...rest,
    data,
    item
  };
};
