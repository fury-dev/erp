import { ListView } from '../../../components/List/ListView';
import { compact } from 'lodash';
import { OrderSetup } from './OrderSetup';
import { HeaderButtons } from '../../../components/List/HeaderButtons';
import { useOrder } from './hooks/useOrder';
import moment from 'moment';
import { FaEdit } from 'react-icons/fa';
import { Order } from '../../../types/items/order';
import { useCallback } from 'react';
import { useDialogContext } from '../../../context/DialogContext';
import { convertFromINR, currencySymbol as _currencySymbol } from '../../../data/Product/currency';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
const OrderList = () => {
  const {
    list: { apiAction, loading, updateQuery, stopPolling },
    orders,
    selected,
    deleteRequest
  } = useOrder();

  const { setComponent } = useDialogContext();
  const currency = useSelector((state: RootState) => state.customization.currency);
  const currencySymbol = _currencySymbol[currency];
  return (
    <div style={{ height: '100%', width: '100' }}>
      <ListView<Order>
        updateApiFilter={updateQuery}
        stopPolling={stopPolling}
        columns={compact([
          {
            field: 'orderId',
            headerName: 'Order ID',
            width: 100
          },
          {
            field: 'customerName',
            headerName: 'Customer Name',
            width: 100
          },
          {
            field: 'orderDate',
            headerName: 'Order Date',
            width: 170,
            getValue: (params) => moment(parseInt(params.orderDate)).format('DD-MM-YYYY:HH:MM')
          },
          {
            field: 'productId',
            headerName: 'Product Id',
            width: 130,
            numeric: true
          },
          {
            field: 'amount',
            headerName: 'Amount',
            width: 70,
            getValue: (params) =>
              ` ${
                params.amount.currency !== currency ? convertFromINR(params.amount.amount, currency).toFixed(2) : params.amount.amount
              } ${currencySymbol} `
          },
          {
            field: 'orderType',
            headerName: 'Type',
            width: 150
          },
          {
            field: 'status',
            headerName: 'Status',
            width: 150,
            getValue: (params) => `${params.status}`
          },

          {
            field: 'paymentStatus',
            headerName: 'Payment Status',
            width: 150,
            getValue: (params) => `${params.paymentStatus ? 'DONE' : 'PENDING'}`
          },
          {
            field: 'deliveryDate',
            headerName: 'Delivery Date',
            width: 150,
            getValue: (params) => (params.deliveryDate ? moment(parseInt(params.deliveryDate)).format('DD-MM-YYYY:HH:MM') : 'N/A')
          },
          {
            field: 'createdAt',
            headerName: 'Created',
            width: 150,
            getValue: (params) => moment(parseInt(params.createdAt || '0')).format('DD-MM-YYYY:HH:MM')
          },
          {
            field: 'updatedAt',
            headerName: 'Modified',
            width: 150,
            getValue: (params) => moment(parseInt(params.updatedAt || '0')).format('DD-MM-YYYY:HH:MM')
          }
        ])}
        rows={orders || []}
        loading={loading}
        headerButtons={
          <HeaderButtons
            buttons={[
              {
                title: 'Add',
                rest: {
                  onClick: () =>
                    setComponent(
                      <OrderSetup
                        open={true}
                        onClose={() => {
                          setComponent(false);
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
                      <OrderSetup
                        order={orders.find((value) => value.id === e.currentTarget.id) as Order}
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
        title={'Order'}
      />
    </div>
  );
};
export default OrderList;
