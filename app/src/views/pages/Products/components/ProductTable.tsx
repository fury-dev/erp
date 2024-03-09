import { ListView } from '../../../../components/List/ListView';
import { compact } from 'lodash';
import { ProductSetup } from '../ProductSetup';
import { HeaderButtons } from '../../../../components/List/HeaderButtons';
import moment from 'moment';
import { FaEdit } from 'react-icons/fa';
import { Product } from '../../../../types/items/product';
import { useCallback, useMemo } from 'react';
import { convertFromINR, currencySymbol as _currencySymbol } from '../../../../data/Product/currency';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useNavigate } from 'react-router-dom';
import { useDialogContext } from '../../../../context/useDialogContext';
import { TQueryParams } from 'src/service/controllers';
import { TItems } from 'src/types';

export interface IProductTable {
  view?: boolean;
  updateApiFilter?: (params: TQueryParams) => Promise<void>;
  selected?: TItems[];
  products: Product[];
  loading: boolean;
  stopPolling: (...rest: any) => any;
  deleteRequest?: (data: string[]) => void;
  apiAction: (...rest: any) => any;
}
export const ProductTable = ({
  view = false,
  updateApiFilter,
  selected,
  loading,
  products,
  stopPolling,
  deleteRequest,
  apiAction
}: IProductTable) => {
  const { setComponent, setOpen } = useDialogContext();

  const currency = useSelector((state: RootState) => state.customization.currency);
  const currencySymbol = useMemo(() => _currencySymbol[currency], [currency]);
  const navigate = useNavigate();
  return (
    <div style={{ height: '100%', width: '100' }}>
      <ListView<Product>
        updateApiFilter={updateApiFilter}
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
            getValue: (item: any) => `
              ${
                item?.price?.currency !== currency ? convertFromINR(item?.price?.amount, currency).toFixed(2) : item?.price?.amount
              } ${currencySymbol}`
          },

          {
            field: 'size',
            headerName: 'Size',
            width: 70,
            getValue: (item) => `${item.size}`
          },
          {
            field: 'inStock',
            headerName: 'In Stock',
            width: 150,
            getValue: (item) => `${item.inStock ? 'Yes' : 'No'}`
          },

          {
            field: 'createdAt',
            headerName: 'Created',
            width: 150,
            getValue: (item) => moment(parseInt(item?.createdAt || '0')).format('DD-MM-YYYY:HH:MM')
          },
          {
            field: 'updatedAt',
            headerName: 'Modified',
            width: 150,
            getValue: (item) => moment(parseInt(item?.updatedAt || '0')).format('DD-MM-YYYY:HH:MM')
          }
        ])}
        rows={products || []}
        loading={loading}
        stopPolling={stopPolling}
        rowOnClick={(item) => navigate('/home/product/' + item.id)}
        headerButtons={
          !view && (
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
                            setComponent(false);
                            setOpen(true);
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
                      // (true);
                      if (selected && selected.length > 0) deleteRequest && (await deleteRequest(selected.map((value) => value.id)));
                    },
                    color: 'error'
                  }
                }
              ]}
            />
          )
        }
        actionCell={
          !view
            ? {
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
                                setOpen(true);
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
              }
            : undefined
        }
        startPolling={apiAction}
        title={'products'}
        showToolbar={!view}
      />
    </div>
  );
};
