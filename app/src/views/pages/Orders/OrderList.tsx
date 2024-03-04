import { ListView } from '../../../components/List/ListView';
import { compact } from 'lodash';
import { OrderSetup } from './OrderSetup';
import { HeaderButtons } from '../../../components/List/HeaderButtons';
import { useOrder } from './hooks/useOrder';
import moment from 'moment';
import { FaEdit } from 'react-icons/fa';
import { Order } from '../../../types/items/order';
import { useCallback } from 'react';
import { useDialogContext } from '../../../context/useDialogContext';
import { convertFromINR, currencySymbol as _currencySymbol } from '../../../data/Product/currency';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';
const OrderList = () => {
  const {
    list: { apiAction, loading, updateQuery, stopPolling },
    orders,
    selected,
    deleteRequest
  } = useOrder();
  const navigate = useNavigate();
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
            width: 250,
            getValue: (item) => item.orderDate
          },
          {
            field: 'product',
            headerName: 'Product Name',
            width: 130,
            numeric: true,
            getValue: (item) => item.product?.name || ''
          },
          {
            field: 'amount',
            headerName: 'Amount',
            width: 70,
            getValue: (item) =>
              ` ${
                item.amount.currency !== currency ? convertFromINR(item.amount.amount, currency).toFixed(2) : item.amount.amount
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
            getValue: (item) => `${item.status}`
          },

          {
            field: 'paymentStatus',
            headerName: 'Payment Status',
            width: 150,
            getValue: (item) => `${item.paymentStatus ? 'DONE' : 'PENDING'}`
          },
          {
            field: 'deliveryDate',
            headerName: 'Delivery Date',
            width: 150,
            getValue: (item) => (item.deliveryDate ? moment(parseInt(item.deliveryDate)).format('DD-MM-YYYY:HH:MM') : 'N/A')
          },
          {
            field: 'createdAt',
            headerName: 'Created',
            width: 150,
            getValue: (item) => moment(parseInt(item.createdAt || '0')).format('DD-MM-YYYY:HH:MM')
          },
          {
            field: 'updatedAt',
            headerName: 'Modified',
            width: 150,
            getValue: (item) => moment(parseInt(item.updatedAt || '0')).format('DD-MM-YYYY:HH:MM')
          }
        ])}
        rows={orders || []}
        loading={loading}
        rowOnClick={(item) => navigate('/home/order/' + item.id)}
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
                  [orders, setComponent]
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
