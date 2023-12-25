import * as React from 'react';
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
const OrderList = () => {
  const {
    list: { apiAction, loading, updateQuery },
    orders,
    selected,
    deleteRequest
  } = useOrder();

  const { setComponent } = useDialogContext();

  return (
    <div style={{ height: '100%', width: '100' }}>
      <ListView<Order>
        updateApiFilter={updateQuery}
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
            getValue: (params) => ` ${params.amount.amount} ${params.amount.currency} `
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
            getValue: (params) => `${params.paymentStatus}`
          },
          {
            field: 'deliveryDate',
            headerName: 'Delivery Date',
            width: 150,
            getValue: (params) => moment(parseInt(params.deliveryDate)).format('DD-MM-YYYY:HH:MM')
          },
          {
            field: 'createdAt',
            headerName: 'Created',
            width: 150,
            getValue: (params) => moment(parseInt(params.createdAt)).format('DD-MM-YYYY:HH:MM')
          },
          {
            field: 'updatedAt',
            headerName: 'Modified',
            width: 150,
            getValue: (params) => moment(parseInt(params.updatedAt)).format('DD-MM-YYYY:HH:MM')
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
        apiAction={apiAction}
        title={'Order'}
      />
    </div>
  );
};
export default OrderList;
