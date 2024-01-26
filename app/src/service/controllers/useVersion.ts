import { useCallback, useEffect } from 'react';
import { ITEMS } from '../../types/items';
import { gql, useMutation, useQuery } from '@apollo/client';

export const useVersion = (item: ITEMS) => {
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
      id: ''
    }
  });

  useEffect(() => {
    if (error) console.error('API error', error);
  }, [error]);

  useEffect(() => {
    console.log(data, error, 'response');
  }, [data]);

  const updateQuery = useCallback(async (id: string, version: string) => {
    await refetch({
      id,
      version,
      item
    });
  }, []);

  const updateMask = useCallback(async (mask: string) => {
    _updateGraphQuery(() => gql(baseQuery(mask)));
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
    updateMask,
    error
  };
};
