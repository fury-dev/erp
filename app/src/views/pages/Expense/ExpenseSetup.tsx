import { DialogBox } from '../../../components/Dialog/DialogBox';
import { Box, Button, Grid } from '@mui/material';
import { Formik } from 'formik';
import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import { useExpense } from './hooks/useExpense';
import { Order } from '../../../types/items/order';
import { FormInputMoney, FormSelect } from '../../../components/Form';
import { Price } from '../../../types';
import { Expense } from '../../../types/items/expense';

const expenseTypeOptions: Expense['expenseType'][] = ['DELIVERY_CHARGES', 'ORDER', 'OTHERS', 'PERSONAL'];
const operationTypeOptions: Expense['operationType'][] = ['CREDIT', 'DEBIT'];

export const ExpenseSetup = ({ open, onClose, expense }: { open: boolean; onClose: () => void; expense?: Expense }) => {
  const theme = useTheme();
  const { submitData } = useExpense();

  return (
    <DialogBox title="Order" open={open} onClose={onClose} width="600px">
      <Formik<Omit<Omit<Expense, 'createdAt'>, 'updatedAt'>>
        initialValues={{
          amount: {
            amount: 0,
            currency: 'INR'
          },
          cashInBank: {
            amount: 0,
            currency: 'INR'
          },
          cashInHand: {
            amount: 0,
            currency: 'INR'
          },
          pnl: {
            amount: 0,
            currency: 'INR'
          },
          expenseType: 'PERSONAL',
          versionId: 1,
          operationType: 'DEBIT',
          id: '',
          note: '',
          ...(expense || {})
        }}
        onSubmit={async (values) => {
          try {
            if (values) await submitData(values as Expense);
            onClose();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form
            noValidate
            onSubmit={handleSubmit}
            style={{
              height: '100%'
            }}
          >
            <Grid container xs={12} spacing={2}>
              <Grid item xs={6}>
                {/* @ts-ignore */}
                <FormSelect<Expense>
                  title="Mode"
                  name="operationType"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  options={operationTypeOptions}
                  value={values.operationType}
                />
              </Grid>
              <Grid item xs={6}>
                <FormSelect<Expense>
                  title="Expense"
                  name="expenseType"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  options={expenseTypeOptions}
                  value={values.expenseType}
                />
              </Grid>
              <Grid item xs={6}>
                <FormInputMoney<Order>
                  title="Amount"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  pricefield="amount.amount"
                  currencyField="amount.currency"
                  value={values.amount as Price}
                />
              </Grid>
              <Grid item xs={6}>
                <FormInputMoney<Order>
                  title="Cash in Bank"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  pricefield="cashInBank.amount"
                  currencyField="cashInBank.currency"
                  value={values.cashInBank as Price}
                />
              </Grid>
              <Grid item xs={6}>
                <FormInputMoney<Order>
                  title="Cash in Hand"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  pricefield="cashInHand.amount"
                  currencyField="cashInHand.currency"
                  value={values.cashInHand as Price}
                />
              </Grid>
              <Grid item xs={4} display="flex" alignItems="center">
                {/* @ts-ignore */}
                <FormControl error={Boolean(touched.note && errors.note)} sx={{ ...theme.typography.customInput, width: '80%' }}>
                  <InputLabel htmlFor="outlined-adornment-name-login">Note</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-seller-price-order"
                    type="text"
                    value={values.note}
                    name="note"
                    onBlur={handleChange}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      borderRight: '0'
                    }}
                  />
                  {touched.note && errors.note && (
                    <FormHelperText error id="standard-weight-helper-text-name-login">
                      {errors.note}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  {values.id ? 'Update' : 'Add'} Expense
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </DialogBox>
  );
};
