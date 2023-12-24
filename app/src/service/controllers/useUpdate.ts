import { useState } from 'react';
import { ITEMS } from '../../types/items';
import { gql, useMutation } from '@apollo/client';
import { Expense } from '../../types/items/expense';
import { Order } from '../../types/items/order';
import { Product } from '../../types/items/product';

export const useUpdate = (item: ITEMS) => {
  const [input, setInput] = useState<Product | Order | Expense>();

  let query = null;
  if (item === 'product') {
    query = gql`
      mutation Product($item: ProductValue!) {
        updateProduct(product: $item) {
          id
          name
          image
          versionId
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
      mutation Order($item: OrderValue!) {
        updateOrder(order: $item) {
          id
          customerName
          versionId
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
      mutation Expense($item: ExpenseValue!) {
        updateExpense(expense: $item) {
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
  const [update] = useMutation(query, {
    variables: {
      item: {}
    }
  });

  const submitData = (data: any) => {
    update({
      variables: {
        item: data
      }
    });
  };

  return {
    submitData
  };
};
