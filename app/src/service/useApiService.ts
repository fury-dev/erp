import { useAdd, useChart, useDelete, useList, useUpdate } from './controllers';
import { ITEMS } from '../types/items';

export const useApiService = (item: ITEMS) => {
  const add = useAdd(item);
  const list = useList(item);
  // const find = useFind(item);
  const update = useUpdate(item);
  const remove = useDelete(item);
  const chart = useChart();

  return {
    add,
    list,
    // find,
    update,
    remove,
    chart
  };
};
