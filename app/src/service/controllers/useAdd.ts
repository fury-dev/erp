import { useState } from 'react';
import { ITEMS } from '../../types/items';
import { gql, useMutation } from '@apollo/client';
import { Product } from '../../types/items/product';
import { Order } from '../../types/items/order';
import { Expense } from '../../types/items/expense';

export const useAdd = (item: ITEMS) => {
  const [input, setInput] = useState<Product | Order | Expense>();

  let query = null;
  if (item === 'product') {
    query = gql`
      mutation Product($item: ProductValue!) {
        addProduct(product: $item) {
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
        addOrder(order: $item) {
          id
          customerName
          orderDate
          orderType
          versionId
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
        addExpense(expense: $item) {
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
  const [addData] = useMutation(query, {
    variables: {
      item: input
    }
  });

  const submitData = (data: any) => {
    addData({
      variables: {
        item: data
      }
    });
  };

  return {
    submitData
  };
};
