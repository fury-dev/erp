import { useCallback, useEffect, useState } from 'react';
import { ITEMS, TItems } from '../../types/items';
import { gql, useQuery } from '@apollo/client';

export const useVersion = <T extends TItems>(item: ITEMS) => {
  const [versions, setVersions] = useState<T[]>([]);
  const updateQueryStructure = (): ((mask?: string) => string) => {
    let query = null;
    let defaultMask = '';
    if (item === 'product') {
      defaultMask = `
      versions{
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
      `;
    } else if (item === 'order') {
      defaultMask = `
        versions{
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
        }
      `;
    } else {
      defaultMask = `
        versions{
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
        }
      `;
    }
    query = (mask: any = defaultMask) => `
    query VerionedItem($id:ID,$all:Boolean) {
      getVersionItem($id:$id,all:$all){ ${mask}}
    }
  `;
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
      id: '',
      all: false
    }
  });

  useEffect(() => {
    if (error) console.error('API error', error);
  }, [error]);

  useEffect(() => {
    console.log(data, error, 'response');
    if (data?.getVersionItem && data?.getVersionItem?.versions.length > 0) {
      setVersions(data?.getVersionItem?.versions);
    }
  }, [data]);

  const updateQuery = useCallback(async (id: string, version: string = '', all: boolean = false) => {
    await refetch({
      id: `${id}:${item}:${version}`,
      all
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
    error,
    versions
  };
};
