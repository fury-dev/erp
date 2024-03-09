import { useApiService } from '../../../../service';
import { useCallback, useEffect, useState } from 'react';
import { Product } from '../../../../types/items/product';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../../../store/reducers';
import { RootState } from '../../../../store';
import lodash, { compact } from 'lodash';
import { useMultiSelect } from '../../../../context/useMultiSelect';
export const useProduct = () => {
  const {
    add,
    update,
    remove: { deleteRequest },
    list: { data, loading, fetchMore, startPolling, updateQuery, stopPolling }
  } = useApiService<Product>('product');
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.product.items);
  const [items, setItems] = useState(products?.value || []);
  const { selected } = useMultiSelect();

  const submitData = useCallback(
    async (data: Product) => {
      if (data?.id) {
        console.log('update', data);

        await update.submitData(lodash.omit(lodash.omit(lodash.omit(data, 'createdAt'), 'updatedAt'), 'productId'));
      } else {
        await add.submitData(data);
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
  }, [data, dispatch]);
  const apiAction = useCallback(async () => {
    startPolling(10000);
  }, [startPolling]);

  return {
    submitData,
    list: { apiAction, data, loading, fetchMore, updateQuery, stopPolling },
    products: items,
    selected,
    deleteRequest
  };
};
