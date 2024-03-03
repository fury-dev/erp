import { useCallback, useEffect } from 'react';
import { ITEMS, TItems } from '../../types/items';
import { gql, useQuery } from '@apollo/client';
import { TChartFilter } from '.';
const POLLING_INTERVAL = 10000;
export type TQueryParams = {
  id?: string[];
  deleted?: number;
  search?: string | null;
  dateBy?: TChartFilter['dateBy'];
  limit?: number;
  dynamicQuery?: Record<string, any>; //mongo base query for find operations
};
export const useList = <T extends TItems>(item: ITEMS) => {
  const updateQueryStructure = (): ((mask?: string) => string) => {
    let query = null;
    let defaultMask = '';
    if (item === 'productSchema') {
      defaultMask = `
        id
        name
        versionId
        productSchemaId
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
      query ProductSchema($filter:ListFilter) {
        productSchemas(filter: $filter){ ${mask}}
      }
    `;
    } else if (item === 'product') {
      defaultMask = `
        id
        name
        versionId
        productId
        image
        productSchemaId
        productSchema{
          id
          name
          versionId
          productSchemaId
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
        price {
          amount
          currency
        }
        size
        quantity
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

          productSchemaId
          productSchema{
            id
            name
            versionId
            productSchemaId
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
          price {
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
    console.log(data, error);
  }, [data, error]);

  const updateQuery = useCallback(
    async (
      { deleted = 0, id = [], search = null, dateBy = 'ALL_TIME', limit = -1, dynamicQuery = undefined }: TQueryParams,
      poll: boolean = true
    ) => {
      stopPolling();
      await refetch({
        filter: {
          id,
          deleted,
          search,
          dateBy,
          limit,
          ...(dynamicQuery ? { dynamicQuery: JSON.stringify(dynamicQuery) } : {})
        }
      });
      if (poll) startPolling(POLLING_INTERVAL);
    },
    [refetch, startPolling, stopPolling]
  );

  const updateMask = useCallback(
    async (mask: string) => {
      _updateGraphQuery(() => gql(baseQuery(mask)));
      stopPolling();
      await refetch();
    },
    [_updateGraphQuery, baseQuery, refetch, stopPolling]
  );
  return {
    loading,
    refetch,
    updateQuery,
    fetchMore,
    data: data as Record<string, T[]>,
    startPolling,
    stopPolling,
    updateMask,
    error
  };
};
