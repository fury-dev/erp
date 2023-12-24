import { useEffect } from 'react';
import { ITEMS } from '../../types/items';
import { DocumentNode, gql, useQuery } from '@apollo/client';

export const useList = (item: ITEMS) => {
  let query = null;
  if (item === 'product') {
    query = gql`
      query Product($id: [ID]) {
        products(id: $id) {
          id
          name
          versionId
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
      query Order($id: [ID]) {
        orders(id: $id) {
          id
          versionId
          customerName
          orderDate
          orderType
          amount
          productId
          status
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
      query Expense($id: [ID]) {
        expense(id: $id) {
          id
          expenseType
          versionId
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

  const { loading, error, data, refetch, updateQuery: updateGraphQuery, fetchMore, startPolling, stopPolling } = useQuery(query);

  useEffect(() => {
    if (error) console.error('API error', error);
  }, [error]);

  useEffect(() => {
    console.log(data, error, 'response');
  }, [data]);

  const updateQuery = () => {
    refetch();
  };
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
