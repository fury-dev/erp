import { useApiService } from '../../../../service';
import { useCallback, useEffect, useState } from 'react';
import { Order } from '../../../../types/items/order';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders } from '../../../../store/reducers';
import { RootState } from '../../../../store';
import lodash from 'lodash';
import { useMultiSelect } from '../../../../context/useMultiSelect';
export const useOrder = () => {
  const {
    add,
    update,
    remove: { deleteRequest },
    list: { data, loading, fetchMore, startPolling, updateQuery, stopPolling }
  } = useApiService<Order>('order');
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.order.items);
  const [items, setItems] = useState(orders?.value);
  const { selected } = useMultiSelect();

  const submitData = useCallback(
    async (data: Order) => {
      if (data?.id) {
        delete data.product;
        await update.submitData(lodash.omit(lodash.omit(lodash.omit(data, 'createdAt'), 'updatedAt'), 'orderId'));
      } else {
        await add.submitData(data);
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
    orders: items,
    selected,
    deleteRequest
  };
};
