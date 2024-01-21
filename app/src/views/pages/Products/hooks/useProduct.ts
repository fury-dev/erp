import { useApiService } from '../../../../service';
import { useCallback, useEffect, useState } from 'react';
import { Product } from '../../../../types/items/product';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../../../store/reducers';
import { RootState } from '../../../../store';
import { useMultiSelect } from '../../../../context/MuliSelectContext';
import lodash, { compact } from 'lodash';
export const useProduct = () => {
  const {
    add,
    update,
    remove: { deleteRequest },
    list: { refetch, data, loading, fetchMore, startPolling, updateQuery, stopPolling }
  } = useApiService('product');
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.product.items);
  const [items, setItems] = useState(products.value);
  const { selected } = useMultiSelect();

  const submitData = useCallback(
    (data: Product) => {
      if (data?.id) {
        console.log('update', data);

        update.submitData(lodash.omit(lodash.omit(lodash.omit(data, 'createdAt'), 'updatedAt'), 'productId'));
      } else {
        add.submitData(data);
      }
    },
    [update, add]
  );

  useEffect(() => {
    if (data?.products) {
      dispatch(
        setProducts({
          value: compact(data.products),
          page: 1
        })
      );
      setItems(compact(data.products));
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
    list: { apiAction, data, loading, fetchMore, updateQuery, stopPolling },
    products: items,
    selected,
    deleteRequest
  };
};
