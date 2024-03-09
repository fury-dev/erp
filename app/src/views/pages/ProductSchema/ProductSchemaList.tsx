import { ListView } from '../../../components/List/ListView';
import { compact } from 'lodash';
import { ProductSchemaSetup } from './ProductSchemaSetup';
import { HeaderButtons } from '../../../components/List/HeaderButtons';
import { useProductSchema } from './hooks/useProductSchema';
import moment from 'moment';
import { FaEdit } from 'react-icons/fa';
import { ProductSchema } from '../../../types/items/product';
import { useCallback } from 'react';
import { convertFromINR, currencySymbol as _currencySymbol } from '../../../data/Product/currency';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { useDialogContext } from '../../../context/useDialogContext';

const ProductSchemaList = () => {
  const {
    list: { apiAction, loading, updateQuery, stopPolling },
    productSchemas,
    selected,
    deleteRequest
  } = useProductSchema();

  const { setComponent, setOpen } = useDialogContext();
  const currency = useSelector((state: RootState) => state.customization.currency);
  const currencySymbol = _currencySymbol[currency];
  const navigate = useNavigate();
  return (
    <div style={{ height: '100%', width: '100' }}>
      <ListView<ProductSchema>
        updateApiFilter={updateQuery}
        columns={compact([
          {
            field: 'productSchemaId',
            headerName: 'Product Schema ID',
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
            getValue: (params: any) => `
            ${
              params.distributorPrice.currency !== currency
                ? convertFromINR(params.distributorPrice.amount, currency).toFixed(2)
                : params.distributorPrice.amount
            } ${currencySymbol}`
          },
          {
            field: 'sellerPrice',
            headerName: 'Seller Price',
            width: 130,
            numeric: true,
            getValue: (params: any) => `
            ${
              params.sellerPrice.currency !== currency
                ? convertFromINR(params.sellerPrice.amount, currency).toFixed(2)
                : params.sellerPrice.amount
            } ${currencySymbol}`
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
        rows={productSchemas || []}
        loading={loading}
        stopPolling={stopPolling}
        rowOnClick={(item) => navigate('/home/productSchema/' + item.id)}
        headerButtons={
          <HeaderButtons
            buttons={[
              {
                title: 'Add',
                rest: {
                  onClick: useCallback(() => {
                    setComponent(
                      <ProductSchemaSetup
                        onClose={() => {
                          console.log('CLOSING');
                          setComponent(false);
                          setOpen(true);
                        }}
                      />
                    );

                    setOpen(true);
                  }, [setComponent, setOpen])
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
                    const productSchema = productSchemas.find((value) => value.id === e.currentTarget.id);
                    if (productSchema) {
                      setComponent(
                        <ProductSchemaSetup
                          productSchema={productSchema}
                          onClose={() => {
                            setComponent(false);
                            setOpen(false);
                          }}
                        />
                      );
                      setOpen(true);
                    }
                  },
                  [productSchemas, setComponent, setOpen]
                ),
                color: 'primary'
              },
              icon: <FaEdit />
            }
          ]
        }}
        startPolling={apiAction}
        title="productSchemas"
      />
    </div>
  );
};
export default ProductSchemaList;
