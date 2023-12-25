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
      mutation Order($id: ID) {
        deleteOrder(id: $item)
      }
    `;
  } else {
    query = gql`
      mutation Expense($id: ID) {
        deleteExpense(id: $id)
      }
    `;
  }
  const [deleteData] = useMutation(query, {
    variables: {
      id: null
    }
  });

  const deleteRequest = (data: string[]) => {
    console.log('deleting', data);
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
