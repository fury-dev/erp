import { ListView } from '../../../components/List/ListView';
import { compact } from 'lodash';
import { ExpenseSetup } from './ExpenseSetup';
import { HeaderButtons } from '../../../components/List/HeaderButtons';
import { useExpense } from './hooks/useExpense';
import moment from 'moment';

import { Expense } from '../../../types/items/expense';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { convertFromINR, currencySymbol as _currencySymbol } from '../../../data/Product/currency';
import { useDialogContext } from '../../../context/useDialogContext';
const ExpenseList = () => {
  const {
    list: { apiAction, loading, updateQuery, stopPolling },
    expense,
    selected,
    deleteRequest
  } = useExpense();

  const { setComponent } = useDialogContext();
  const currency = useSelector((state: RootState) => state.customization.currency);
  const currencySymbol = _currencySymbol[currency];
  return (
    <div style={{ height: '100%', width: '100' }}>
      <ListView<Expense>
        updateApiFilter={updateQuery}
        stopPolling={stopPolling}
        columns={compact([
          {
            field: 'expenseId',
            headerName: 'Expense ID',
            width: 100
          },
          {
            field: 'operationType',
            headerName: 'Mode',
            width: 100
          },
          {
            field: 'expenseType',
            headerName: 'Expense Type',
            width: 100
          },
          {
            field: 'amount',
            headerName: 'Amount',
            width: 70,
            getValue: (params) => `${convertFromINR(params.amount.amount, currency).toFixed(2)}  ${currencySymbol}`
          },
          {
            field: 'cashInHand',
            headerName: 'Cash in Hand',
            width: 70,
            getValue: (params) => `${convertFromINR(params.cashInHand.amount, currency).toFixed(2)}  ${currencySymbol}`
          },
          {
            field: 'cashInBank',
            headerName: 'Cash in Bank',
            width: 70,
            getValue: (params) => ` 
            ${convertFromINR(params.cashInBank.amount, currency).toFixed(2)}  ${currencySymbol}
            `
          },
          {
            field: 'pnl',
            headerName: 'P/L',
            width: 70,
            getValue: (params) =>
              `${convertFromINR(
                params.cashInBank.amount + params.cashInHand.amount + params.amount.amount * (params.operationType === 'DEBIT' ? -1 : 1),
                currency
              ).toFixed(2)} ${currencySymbol} `
          },
          {
            field: 'note',
            headerName: 'Note',
            width: 70
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
        rows={expense || []}
        loading={loading}
        headerButtons={
          <HeaderButtons
            buttons={[
              {
                title: 'Add',
                rest: {
                  onClick: () =>
                    setComponent(
                      <ExpenseSetup
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
        // actionCell={{
        //   field: 'Actions',
        //   headerName: 'Actions',
        //   width: 80,
        //   buttons: [
        //     {
        //       title: 'Update',
        //       rest: {
        //         onClick: useCallback(
        //           (e: any) => {
        //             setComponent(
        //               <ExpenseSetup
        //                 expense={expense.find((value) => value.id === e.currentTarget.id) as Expense}
        //                 open={true}
        //                 onClose={() => {
        //                   setComponent(false);
        //                 }}
        //               />
        //             );
        //           },
        //           [selected]
        //         ),
        //         color: 'primary'
        //       },
        //       icon: <FaEdit />
        //     }
        //   ]
        // }}
        startPolling={apiAction}
        title={'Expense'}
      />
    </div>
  );
};
export default ExpenseList;
