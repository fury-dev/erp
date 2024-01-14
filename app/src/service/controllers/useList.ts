import { useCallback, useEffect } from 'react';
import { ITEMS } from '../../types/items';
import { gql, useQuery } from '@apollo/client';
import { TChartFilter } from '.';
const POLLING_INTERVAL = 10000;
export type TQueryParams = {
  id?: string[];
  deleted?: number;
  search?: string | null;
  dateBy?: TChartFilter['dateBy'];
  limit?: number;
};
export const useList = (item: ITEMS) => {
  const updateQueryStructure = (): ((mask?: string) => string) => {
    let query = null;
    let defaultMask = '';
    if (item === 'product') {
      defaultMask = `
        id
        name
        versionId
        productId
        image
        distributorPrice {
          amount
          currency
        }
        sellerPrice {
          amount
          currency
        }
        size
        inStock
        createdAt
        updatedAt
      `;
      query = (mask: any = defaultMask) => `
        query Product($filter:ListFilter) {
          products(filter: $filter){ ${mask}}
        }
      `;
    } else if (item === 'order') {
      defaultMask = `
        id
        versionId
        customerName
        orderId
        orderDate
        orderType
        amount {
          amount
          currency
        }
        productId
        status
        product {
          id
          name
          versionId
          productId
          image
          distributorPrice {
            amount
            currency
          }
          sellerPrice {
            amount
            currency
          }
          size
          inStock
        }
        location {
          address
          pincode
          city
          state
          country
        }
        paymentStatus
        deliveryDate
        createdAt
        updatedAt
      `;
      query = (mask: any = defaultMask) => `
        query Order($filter:ListFilter) {
          orders(filter: $filter){${mask}}
        }
      `;
    } else {
      defaultMask = `
        id
        expenseType
        versionId
        expenseId
        amount {
          amount
          currency
        }
        cashInBank {
          amount
          currency
        }
        cashInHand {
          amount
          currency
        }
        note
        operationType
        createdAt
        updatedAt
      `;
      query = (mask: any = defaultMask) => `
        query Expense($filter:ListFilter) {
          expenses(filter: $filter){${mask}}
        }
      `;
    }
    return query;
  };

  const baseQuery = updateQueryStructure();
  const {
    loading,
    error,
    data,
    refetch,
    updateQuery: _updateGraphQuery,
    fetchMore,
    startPolling,
    stopPolling
  } = useQuery(gql(baseQuery()), {
    variables: {
      id: [],
      deleted: 1,
      dateBy: 'ALL_TIME'
    }
  });

  useEffect(() => {
    if (error) console.error('API error', error);
  }, [error]);

  useEffect(() => {
    console.log(data, error, 'response');
  }, [data]);

  const updateQuery = useCallback(
    async ({ deleted = 0, id = [], search = null, dateBy = 'ALL_TIME', limit = -1 }: TQueryParams, poll: boolean = true) => {
      stopPolling();
      await refetch({
        filter: {
          id,
          deleted,
          search,
          dateBy,
          limit
        }
      });
      if (poll) startPolling(POLLING_INTERVAL);
    },
    []
  );

  const updateMask = useCallback(async (mask: string) => {
    console.log(gql(baseQuery(mask)));
    _updateGraphQuery(() => gql(baseQuery(mask)));
    stopPolling();
    await refetch();
  }, []);
  return {
    loading,
    refetch,
    updateQuery,
    fetchMore,
    data,
    startPolling,
    stopPolling,
    updateMask
  };
};
