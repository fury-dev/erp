import { useApiService } from '../../../../service';
import { useCallback, useEffect, useState } from 'react';
import { ProductSchema } from '../../../../types/items/product';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../../../store/reducers';
import { RootState } from '../../../../store';
import lodash, { compact } from 'lodash';
import { useMultiSelect } from '../../../../context/useMultiSelect';
export const useProductSchema = () => {
  const {
    add,
    update,
    remove: { deleteRequest },
    list: { data, loading, fetchMore, startPolling, updateQuery, stopPolling }
  } = useApiService<ProductSchema>('productSchema');
  const dispatch = useDispatch();
  const productSchema = useSelector((state: RootState) => state.productSchema.items);
  const [items, setItems] = useState(productSchema?.value);
  const { selected } = useMultiSelect();

  const submitData = useCallback(
    async (data: ProductSchema) => {
      if (data?.id) {
        console.log('update', data);

        await update.submitData(lodash.omit(lodash.omit(lodash.omit(data, 'createdAt'), 'updatedAt'), 'productSchemaId'));
      } else {
        await add.submitData(data);
      }
    },
    [update, add]
  );

  useEffect(() => {
    if (data?.productSchemas) {
      dispatch(
        setProducts({
          value: compact(data.productSchemas),
          page: 1
        })
      );
      setItems(compact(data.productSchemas));
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
    productSchemas: items,
    selected,
    deleteRequest
  };
};
