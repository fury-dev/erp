import { useApiService } from '../../../../service';
import { useCallback, useEffect, useState } from 'react';
import { ProductSchema } from '../../../../types/items/product';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../../../store/reducers';
import { RootState } from '../../../../store';
import { useMultiSelect } from '../../../../context/MuliSelectContext';
import lodash, { compact } from 'lodash';
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
  console.log(data);

  const submitData = useCallback(
    (data: ProductSchema) => {
      if (data?.id) {
        console.log('update', data);

        update.submitData(lodash.omit(lodash.omit(lodash.omit(data, 'createdAt'), 'updatedAt'), 'productSchemaId'));
      } else {
        add.submitData(data);
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
    productSchemas: items,
    selected,
    deleteRequest
  };
};