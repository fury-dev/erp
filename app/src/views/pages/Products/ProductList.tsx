import * as React from 'react';
import { ListView } from '../../../components/List/ListView';
import { compact } from 'lodash';
import { ProductSetup } from './ProductSetup';
import { HeaderButtons } from '../../../components/List/HeaderButtons';
import { useProduct } from './hooks/useProduct';
import moment from 'moment';
import { FaEdit } from 'react-icons/fa';
import { Product } from '../../../types/items/product';
import { useCallback } from 'react';
import { useDialogContext } from '../../../context/DialogContext';
const ProductList = () => {
  const {
    list: { apiAction, loading, updateQuery, stopPolling },
    products,
    selected,
    deleteRequest
  } = useProduct();

  const { setComponent } = useDialogContext();

  return (
    <div style={{ height: '100%', width: '100' }}>
      <ListView<Product>
        updateApiFilter={updateQuery}
        columns={compact([
          {
            field: 'productId',
            headerName: 'Product ID',
            width: 100
          },
          {
            field: 'name',
            headerName: 'Name',
            width: 100
          },
          {
            field: 'distributorPrice',
            headerName: 'Distributor Price',
            width: 170,
            getValue: (params: any) => ` ${params?.distributorPrice.amount} ${params.distributorPrice.currency} `
          },
          {
            field: 'sellerPrice',
            headerName: 'Seller Price',
            width: 130,
            numeric: true,
            getValue: (params: any) => ` ${params?.sellerPrice.amount} ${params.sellerPrice.currency} `
          },
          {
            field: 'size',
            headerName: 'Size',
            width: 70,
            getValue: (params) => `${(params.size || [])?.length > 0 ? params.size?.join(',') : ''}`
          },
          {
            field: 'inStock',
            headerName: 'In Stock',
            width: 150,
            getValue: (params) => `${params.inStock ? 'Yes' : 'No'}`
          },

          {
            field: 'createdAt',
            headerName: 'Created',
            width: 150,
            getValue: (params) => moment(parseInt(params?.createdAt || '0')).format('DD-MM-YYYY:HH:MM')
          },
          {
            field: 'updatedAt',
            headerName: 'Modified',
            width: 150,
            getValue: (params) => moment(parseInt(params?.updatedAt || '0')).format('DD-MM-YYYY:HH:MM')
          }
        ])}
        rows={products || []}
        loading={loading}
        stopPolling={stopPolling}
        headerButtons={
          <HeaderButtons
            buttons={[
              {
                title: 'Add',
                rest: {
                  onClick: () =>
                    setComponent(
                      <ProductSetup
                        open={true}
                        onClose={() => {
                          // setComponent(false);
                        }}
                      />
                    )
                }
              },

              {
                title: 'Delete',
                rest: {
                  onClick: async () => {
                    // setOpen(true);
                    if (selected.length > 0) await deleteRequest(selected.map((value) => value.id));
                  },
                  color: 'error'
                }
              }
            ]}
          />
        }
        actionCell={{
          field: 'Actions',
          headerName: 'Actions',
          width: 80,
          buttons: [
            {
              title: 'Update',
              rest: {
                onClick: useCallback(
                  (e: any) => {
                    setComponent(
                      <ProductSetup
                        product={products.find((value) => value.id === e.currentTarget.id) as Product}
                        open={true}
                        onClose={() => {
                          setComponent(false);
                        }}
                      />
                    );
                  },
                  [selected]
                ),
                color: 'primary'
              },
              icon: <FaEdit />
            }
          ]
        }}
        startPolling={apiAction}
        title={'Product'}
      />
    </div>
  );
};
export default ProductList;
