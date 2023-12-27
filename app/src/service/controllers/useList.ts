import { useCallback, useEffect } from 'react';
import { ITEMS } from '../../types/items';
import { gql, useQuery } from '@apollo/client';
const POLLING_INTERVAL = 10000;
export type TQueryParams = {
  id?: string[];
  deleted?: boolean;
  search?: string | null;
};
export const useList = (item: ITEMS) => {
  let query = null;
  if (item === 'product') {
    query = gql`
      query Product($id: [ID], $deleted: Boolean, $search: String) {
        products(id: $id, deleted: $deleted, search: $search) {
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
        }
      }
    `;
  } else if (item === 'order') {
    query = gql`
      query Order($id: [ID], $deleted: Boolean, $search: String) {
        orders(id: $id, deleted: $deleted, search: $search) {
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
          location {
            address
            pincode
            city
            state
            country
          }
          string
          paymentStatus
          deliveryDate
          createdAt
          updatedAt
        }
      }
    `;
  } else {
    query = gql`
      query Expense($id: [ID], $deleted: Boolean, $search: String) {
        expense(id: $id, deleted: $deleted, search: $search) {
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
          pnl
          createdAt
          updatedAt
        }
      }
    `;
  }

  const {
    loading,
    error,
    data,
    refetch,
    updateQuery: updateGraphQuery,
    fetchMore,
    startPolling,
    stopPolling
  } = useQuery(query, {
    variables: {
      id: [],
      deleted: false
    }
  });

  useEffect(() => {
    if (error) console.error('API error', error);
  }, [error]);

  useEffect(() => {
    console.log(data, error, 'response');
  }, [data]);

  const updateQuery = useCallback(async ({ deleted = false, id = [], search = null }: TQueryParams) => {
    stopPolling();
    await refetch({
      id,
      deleted,
      search
    });
    startPolling(POLLING_INTERVAL);
  }, []);
  return {
    loading,
    refetch,
    updateQuery,
    fetchMore,
    data,
    startPolling,
    stopPolling
  };
};
