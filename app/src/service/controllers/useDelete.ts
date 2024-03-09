import { ITEMS } from '../../types/items';
import { gql, useMutation } from '@apollo/client';

export const useDelete = (item: ITEMS) => {
  let query = null;
  if (item === 'product') {
    query = gql`
      mutation Product($id: [ID!]) {
        deleteProduct(id: $id) {
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
      mutation Order($id: [ID!]) {
        deleteOrder(id: $id) {
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
            createdAt
            updatedAt
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
      }
    `;
  } else if (item === 'expense') {
    query = gql`
      mutation Expense($id: [ID!]) {
        deleteExpense(id: $id) {
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
  } else {
    query = gql`
      mutation ProductSchema($id: [ID!]) {
        deleteProductSchema(id: $id) {
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
        }
      }
    `;
  }
  const [deleteData] = useMutation(query, {
    variables: {
      id: null
    }
  });

  const deleteRequest = (data: string[]) => {
    deleteData({
      variables: {
        id: data
      }
    });
  };

  return {
    deleteRequest
  };
};
