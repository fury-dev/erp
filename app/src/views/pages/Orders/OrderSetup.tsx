import { DialogBox } from '../../../components/Dialog/DialogBox';
import { Box, Button, FormLabel, Grid } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import { useOrder } from './hooks/useOrder';
import { Order } from '../../../types/items/order';
import { FormDateTime, FormInputMoney, FormSelect } from '../../../components/Form';
import { Price } from '../../../types';
import { useMemo, useState } from 'react';
import { useProduct } from '../Products/hooks/useProduct';
import { Product } from '../../../types/items/product';
import { useLocationApi } from '../../../hooks/useLocationApi';
import GoogleMapReact from 'google-map-react';

const _validation = Yup.object().shape({
  name: Yup.string().required()
});

const orderStatus: Order['status'][] = ['DELIVERED', 'OUT_FOR_DELIVERY', 'PENDING', 'SHIPPED'];
const orderType: Order['orderType'][] = ['CASH_ON_DELIVERY', 'PREPAID'];
const AnyReactComponent = ({ text }: any) => <div>{text}</div>;

export const OrderSetup = ({ open, onClose, order }: { open: boolean; onClose: () => void; order?: Order }) => {
  const theme = useTheme();
  const { submitData } = useOrder();
  const {
    list: { data, updateQuery }
  } = useProduct();
  const [showMap, setShowMap] = useState<boolean>(false);

  const { cities, countries, state, getCities, getCountries, getStates } = useLocationApi();
  const defaultProps = {
    zoom: 11
  };
  return (
    <DialogBox title="Order" open={open} onClose={onClose} width="600px">
      <Formik<Order>
        initialValues={{
          customerName: '',
          amount: {
            amount: 0,
            currency: 'INR'
          },
          orderDate: new Date().toISOString(),
          deliveryDate: '',
          productId: '',
          status: 'PENDING',
          paymentStatus: false,
          orderType: 'CASH_ON_DELIVERY',
          id: '',
          versionId: 1,
          geoLocation: null,
          ...(order || {})
        }}
        onSubmit={async (values, {}) => {
          try {
            if (values.status === 'DELIVERED') {
              values.deliveryDate = new Date().toISOString();
            }
            if (values) await submitData(values as Order);
            onClose();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form
            noValidate
            onSubmit={handleSubmit}
            style={{
              height: '100%',
              width: '100%'
            }}
          >
            {showMap && (
              <Box
                style={{
                  zIndex: 5555,
                  width: '100%'
                }}
              >
                <GoogleMapReact
                  {...defaultProps}
                  bootstrapURLKeys={{ key: '' }}
                  style={{
                    zIndex: 44,
                    width: '100%'
                  }}
                >
                  <AnyReactComponent
                    //@ts-ignore
                    style={{
                      width: '100%'
                    }}
                    lat={values.geoLocation?.coords.latitude}
                    lng={values.geoLocation?.coords.longitude}
                    text="My Marker"
                  />
                </GoogleMapReact>
              </Box>
            )}
            <Grid container xs={12} spacing={2}>
              <Grid item xs={6}>
                {/* @ts-ignore */}
                <FormControl error={Boolean(touched.customerName && errors.customerName)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-name-login">Customer Name</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-name-order"
                    type="text"
                    value={values.customerName}
                    name="customerName"
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
              <Grid item xs={6}>
                <FormDateTime<Order>
                  title="Order Date"
                  name="orderDate"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  value={values.orderDate}
                />
              </Grid>
              <Grid item xs={6}>
                <FormSelect<Order>
                  title="Order Status"
                  name="status"
                  errors={errors}
                  touched={touched}
                  handleChange={(e: React.ChangeEvent<any>) => {
                    if (e.target.value === 'DELIVERED') {
                      setFieldValue('deliveryDate', new Date());
                    } else if (values.deliveryDate) {
                      setFieldValue('deliveryDate', undefined);
                    }
                    handleChange(e);
                  }}
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
              <Grid item xs={6}>
                <FormInputMoney<Order>
                  title="Order Amount"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  pricefield="amount.amount"
                  currencyField="amount.currency"
                  value={values.amount as Price}
                />
              </Grid>
              <Grid item xs={4} display="flex" alignItems="center">
                <FormSelect<Order>
                  title="Product"
                  name="productId"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  apiAction={updateQuery}
                  options={useMemo(
                    () =>
                      (data?.products || []).map((value: Product) => ({
                        value: value.id,
                        label: value.name
                      })),
                    [data]
                  )}
                  value={values.productId}
                />
              </Grid>
              <Grid
                sx={{
                  borderStyle: 'solid',
                  borderWidth: '0.1px',
                  borderColor: '#DDDD',
                  borderRadius: '8px',
                  margin: '15px',
                  paddingY: '5px'
                }}
                container
                xs={12}
                spacing={1}
              >
                <FormLabel sx={{ padding: '5px' }}>Location Details</FormLabel>

                <Grid item xs={12}>
                  {/* @ts-ignore */}
                  <FormControl error={Boolean(touched.location && errors.location)} sx={{ ...theme.typography.customInput, width: '80%' }}>
                    <InputLabel htmlFor="outlined-adornment-name-login">Address</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-seller-price-order"
                      type="text"
                      value={values.location?.address}
                      name={'location.address'}
                      onBlur={handleChange}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        borderRight: '0'
                      }}
                    />
                    {touched.location && errors.location && (
                      <FormHelperText error id="standard-weight-helper-text-name-login">
                        {errors.location}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormSelect<Order>
                    title="Country"
                    name="location.country"
                    errors={errors}
                    touched={touched}
                    handleChange={(e: React.ChangeEvent<any>) => {
                      handleChange(e);
                      getStates(countries.find((value) => value.name === e.target.value)['iso2']);
                    }}
                    apiAction={getCountries}
                    options={useMemo(
                      () =>
                        (countries || []).map((value) => ({
                          value: value.name,
                          label: value.name
                        })),
                      [countries]
                    )}
                    value={values.location?.country}
                    sx={{
                      width: '100%'
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormSelect<Order>
                    title="State"
                    name="location.state"
                    errors={errors}
                    touched={touched}
                    handleChange={(e: React.ChangeEvent<any>) => {
                      handleChange(e);

                      getCities(
                        state.find((value) => value.name === e.target.value)['iso2'],
                        countries.find((item) => item.name === values.location?.country)['iso2']
                      );
                    }}
                    apiAction={getStates}
                    options={useMemo(
                      () =>
                        (state || []).map((value) => ({
                          value: value.name,
                          label: value.name
                        })),
                      [state]
                    )}
                    value={values.location?.state}
                    sx={{
                      width: '100%'
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormSelect<Order>
                    title="City"
                    name="location.city"
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    apiAction={getCities}
                    options={useMemo(
                      () =>
                        (cities || []).map((value) => ({
                          value: value.name,
                          label: value.name
                        })),
                      [cities]
                    )}
                    value={values.location?.city}
                  />
                </Grid>
                <Grid item xs={6}>
                  {/* @ts-ignore */}
                  <FormControl error={Boolean(touched.location && errors.location)} sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-name-login">Pincode</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-seller-price-order"
                      type="number"
                      value={values.location?.pincode}
                      name={'location.pincode'}
                      onBlur={handleChange}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        borderRight: '0'
                      }}
                    />
                    {touched.location && errors.location && (
                      <FormHelperText error id="standard-weight-helper-text-name-login">
                        {errors.location}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Box flexDirection="row" display="flex" alignItems="center">
                    <Button
                      disableElevation
                      size="large"
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setFieldValue('geoLocation', position);
                            setShowMap(true);
                          },
                          (error) => {
                            console.error(error);
                          }
                        )
                      }
                    >
                      Locate Me
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  {values.id ? 'Update' : 'Add'} Order
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </DialogBox>
  );
};
