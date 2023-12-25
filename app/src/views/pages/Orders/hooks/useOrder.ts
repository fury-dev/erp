import { useApiService } from '../../../../service';
import { useCallback, useEffect, useState } from 'react';
import { Order } from '../../../../types/items/order';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders } from '../../../../store/reducers';
import { RootState } from '../../../../store';
import { useMultiSelect } from '../../../../context/MuliSelectContext';
import lodash from 'lodash';
export const useOrder = () => {
  const {
    add,
    update,
    remove: { deleteRequest },
    list: { refetch, data, loading, fetchMore, startPolling, updateQuery }
  } = useApiService('order');
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.order.items);
  const [items, setItems] = useState(orders.value);
  const { selected } = useMultiSelect();

  const submitData = useCallback(
    (data: Order) => {
      if (data?.id) {
        console.log('update', data);
        update.submitData(lodash.omit(lodash.omit(data, 'createdAt'), 'updatedAt'));
      } else {
        add.submitData(data);
      }
    },
    [update, add]
  );

  useEffect(() => {
    if (data?.orders) {
      dispatch(
        setOrders({
          value: data.orders,
          page: 1
        })
      );
      setItems(data.orders);
    }
  }, [data]);
  const apiAction = useCallback(
    async (...rest: any) => {
      startPolling(10000);
    },
    [data, startPolling]
  );

  return {
    submitData,
    list: { apiAction, data, loading, fetchMore, updateQuery },
    orders: items,
    selected,
    deleteRequest
  };
};
