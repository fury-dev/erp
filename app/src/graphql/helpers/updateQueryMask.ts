import { ITEMS } from 'src/types';

export const updateQueryStructure = (item: ITEMS): ((mask?: string) => string) => {
  let query = null;
  let defaultMask = '';
  if (item === 'productSchema') {
    defaultMask = `
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
      `;
    query = (mask: any = defaultMask) => `
      query ProductSchema($filter:ListFilter) {
        productSchemas(filter: $filter){ ${mask}}
      }
    `;
  } else if (item === 'product') {
    defaultMask = `
        id
        name
        versionId
        productId
        image
        productSchemaId
        productSchema{
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
       
        }
        price {
          amount
          currency
        }
        size
        quantity
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
          productSchemaId
          price {
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
