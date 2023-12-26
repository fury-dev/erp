import { DialogBox } from '../../../components/Dialog/DialogBox';
import { Box, Button, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import { useOrder } from './hooks/useOrder';
import { Order } from '../../../types/items/order';
import { currencySupport } from '../../../data/Product/currency';
import { FormDateTime, FormSelect } from '../../../components/Form';

const validation = Yup.object().shape({
  name: Yup.string().required()
});

const orderStatus: Order['status'][] = ['DELIVERED', 'OUT_FOR_DELIVERY', 'PENDING', 'SHIPPED'];
const orderType: Order['orderType'][] = ['COD', 'PREPAID'];

export const OrderSetup = ({ open, onClose, order }: { open: boolean; onClose: () => void; order?: Order }) => {
  const theme = useTheme();
  const { submitData } = useOrder();

  return (
    <DialogBox title="Order" open={open} onClose={onClose} width="600px">
      <Formik
        initialValues={{
          customerName: '',
          amount: {
            amount: 0,
            currency: ''
          },
          orderDate: new Date().toISOString(),
          deliveryDate: undefined,
          productId: null,
          status: 'PENDING',
          paymentStatus: false,
          orderType: 'COD',
          id: '',
          versionId: 1,
          ...(order || {})
        }}
        validation={validation}
        onSubmit={async (values, {}) => {
          try {
            if (values) await submitData(values as Order);
            onClose();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
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
                <FormControl error={Boolean(touched.customerName && errors.customerName)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-name-login">Customer Name</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-name-order"
                    type="customerName"
                    value={values.customerName}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Customer Name"
                    inputProps={{}}
                  />
                  {touched.customerName && errors.customerName && (
                    <FormHelperText error id="standard-weight-helper-text-name-login">
                      {errors.customerName}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6} marginTop={'15px'}>
                <FormDateTime<Order>
                  title="Order Date"
                  name="orderDate"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  value={values.orderDate}
                />
              </Grid>
              <Grid item xs={6}  alignItems="center">
                <InputLabel htmlFor="outlined-adornment-name-login">Amount</InputLabel>
                <Box display="flex" flexDirection="row" width="80%" justifyContent="space-between" alignItems="center">
                  <FormControl
                    error={Boolean(touched.amount?.amount && errors.amount?.amount)}
                    //@ts-ignore
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-name-login">Price</InputLabel>

                    <OutlinedInput
                      id="outlined-adornment-seller-price-order"
                      type="number"
                      value={values.amount.amount}
                      name="amount.amount"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Amount"
                      inputProps={{}}
                      style={{
                        width: '90px'
                      }}
                    />
                    {touched.amount?.amount && errors.amount?.amount && (
                      <FormHelperText error id="standard-weight-helper-text-name-login">
                        {errors.amount?.amount}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormSelect<Order>
                    title="Currency"
                    name="amount.currency"
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    options={currencySupport}
                    value={values.amount.currency}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <FormSelect<Order>
                  title="Order Status"
                  name="status"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  options={orderStatus}
                  value={values.status}
                />
              </Grid>
              <Grid item xs={6}>
                <FormSelect<Order>
                  title="Order Type"
                  name="orderType"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  options={orderType}
                  value={values.orderType}
                />
              </Grid>
              <Grid item xs={4} display="flex" alignItems="center">
                <FormControlLabel onChange={handleChange} control={<Checkbox defaultChecked />} label="In Stock" />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Add Order
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </DialogBox>
  );
};
