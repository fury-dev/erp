import { ITEMS } from '../../types/items';
import { gql, useMutation } from '@apollo/client';

export const useUpdate = (item: ITEMS) => {
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
        updateExpense(expense: $item) {
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
          pnl {
            amount
            currency
          }
          note
          operationType
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
