import { useAdd, useChart, useDelete, useList, useUpdate, useVersion } from './controllers';
import { ITEMS, TItems } from '../types/items';

export const useApiService = <T extends TItems>(item: ITEMS) => {
  const add = useAdd<T>(item);
  const list = useList<T>(item);
  // const find = useFind(item);
  const update = useUpdate(item);
  const remove = useDelete(item);
  const chart = useChart();
  const version = useVersion<T>(item);

  return {
    add,
    list,
    // find,
    update,
    remove,
    chart,
    version
  };
};
