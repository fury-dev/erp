import { ITEMS, TItems } from '../../types/items';
import { gql, useMutation } from '@apollo/client';

export const useAdd = <_T extends TItems>(item: ITEMS) => {
  let query = null;
  if (item === 'productSchema') {
    query = gql`
      mutation ProductSchema($item: ProductSchemaValue!) {
        addProductSchema(productSchema: $item) {
          id
          name
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
  } else if (item === 'product') {
    query = gql`
      mutation Product($item: ProductValue!) {
        addProduct(product: $item) {
          id
          name
          image
          versionId
          productSchemaId
          price {
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
      }
    `;
  }
  const [addData] = useMutation(query, {
    variables: {
      item: []
    }
  });

  const submitData = async (data: any) => {
    await addData({
      variables: {
        item: data
      }
    });
  };

  return {
    submitData
  };
};
