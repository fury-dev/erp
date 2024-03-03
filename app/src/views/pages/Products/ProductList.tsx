import { ListView } from '../../../components/List/ListView';
import { compact } from 'lodash';
import { ProductSetup } from './ProductSetup';
import { HeaderButtons } from '../../../components/List/HeaderButtons';
import { useProduct } from './hooks/useProduct';
import moment from 'moment';
import { FaEdit } from 'react-icons/fa';
import { Product } from '../../../types/items/product';
import { useCallback } from 'react';
import { convertFromINR, currencySymbol as _currencySymbol } from '../../../data/Product/currency';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { useDialogContext } from '../../../context/useDialogContext';

const ProductList = () => {
  const {
    list: { apiAction, loading, updateQuery, stopPolling },
    products,
    selected,
    deleteRequest
  } = useProduct();

  const { setComponent, setOpen } = useDialogContext();
  const currency = useSelector((state: RootState) => state.customization.currency);
  const currencySymbol = _currencySymbol[currency];
  const navigate = useNavigate();
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
            field: 'price',
            headerName: 'Price',
            width: 170,
            getValue: (params: any) => `
            ${
              params.price.currency !== currency ? convertFromINR(params.price.amount, currency).toFixed(2) : params.price.amount
            } ${currencySymbol}`
          },

          {
            field: 'size',
            headerName: 'Size',
            width: 70,
            getValue: (params) => `${params.size}`
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
        rowOnClick={(item) => navigate('/home/product/' + item.id)}
        headerButtons={
          <HeaderButtons
            buttons={[
              {
                title: 'Add',
                rest: {
                  onClick: () => {
                    setComponent(
                      <ProductSetup
                        open={true}
                        onClose={() => {
                          // setComponent(false);
                        }}
                      />
                    );

                    setOpen(true);
                  }
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
                    setOpen(true);
                  },
                  [products, setComponent, setOpen]
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
