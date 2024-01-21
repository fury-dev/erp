import { Grid } from '@mui/material';
import { gridSpacing } from '../../../store/constant';
import TotalAmountCard from './TotalAmountCard';
import { useApiService } from '../../../service';
import { useCallback, useEffect, useMemo } from 'react';
import { Expense } from '../../../types/items/expense';
import { convertFromINR, currencySymbol as _currencySymbol } from '../../../data/Product/currency';
import { sum } from 'lodash';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface ITotalEarningCard {
  isLoading: boolean;
}
export const TotalEarningCard = ({ isLoading }: ITotalEarningCard) => {
  const {
    list: { data, updateQuery, updateMask }
  } = useApiService('expense');
  const currency = useSelector((state: RootState) => state.customization.currency);
  const currencySymbol = _currencySymbol[currency];
  useEffect(() => {
    updateQuery({
      dateBy: 'ALL_TIME',
      deleted: 0
    });
    updateMask(`operationType
    amount
    `);
  }, []);
  const expense: Expense[] = useMemo(() => data?.expenses || [], [data]);
  const getCurrency = useCallback(
    (mode: Expense['operationType']) =>
      `${convertFromINR(
        sum(expense.filter((value: Expense) => value.operationType === mode).map((value) => value.amount.amount)),
        currency
      ).toFixed(2)} ${currencySymbol}`,
    [expense, currency]
  );
  console.log(expense, data);
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item sm={6} xs={12} md={6} lg={12}>
        <TotalAmountCard isLoading={isLoading} amount={getCurrency('CREDIT')} title={'Total Credit Amount'} />
      </Grid>
      <Grid item sm={6} xs={12} md={6} lg={12}>
        <TotalAmountCard isLoading={isLoading} amount={getCurrency('DEBIT')} title={'Total Debit Amount'} />
      </Grid>
    </Grid>
  );
};
