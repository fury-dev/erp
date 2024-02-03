import { useEffect, useState } from 'react';
import { ITEMS, TItems } from '../../types/items';
import { useList } from '.';
import { useDispatch } from 'react-redux';
import { setExpenseView, setOrderView, setProductSchemaView, setProductView } from '../../store/reducers';

export const useFind = <T extends TItems>(_item: ITEMS) => {
  const { data, error, ...rest } = useList<T>(_item);
  const [item, setItem] = useState<T | null | undefined>();
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) console.error('API error', error);

    if (data)
      setItem(() => {
        const item = data[`${_item}s`][0];
        if (_item === 'expense') {
          dispatch(setExpenseView(item));
        } else if (_item === 'order') {
          dispatch(setOrderView(item));
        } else if (_item === 'product') {
          dispatch(setProductView(item));
        } else {
          dispatch(setProductSchemaView(item));
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
