import { DialogBox } from '../../../components/Dialog/DialogBox';
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, MenuItem, Select } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { currencySupport } from '../../../data/Order/currency';
import { MdDeleteOutline } from 'react-icons/md';
import { LegacyRef, useRef, useState } from 'react';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import { useOrder } from './hooks/useOrder';
import { Order } from '../../../types/items/order';

const validation = Yup.object().shape({
  name: Yup.string().required()
});
export const OrderSetup = ({ open, onClose, order }: { open: boolean; onClose: () => void; order?: Order }) => {
  const theme = useTheme();
  const [size, setSize] = useState('');
  const { submitData } = useOrder();
  const fileRef = useRef<LegacyRef<HTMLInputElement>>(null);
  const handleSaveSize = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    setFieldValue: (arg0: string, arg1: any[]) => void,
    values: { size: string | any[] }
  ) => {
    if (!values.size.includes(size) && size) {
      setFieldValue('size', [...values.size, size]);
      setSize('');
    }
  };

  return (
    <DialogBox title="Order" open={open} onClose={onClose} width="600px">
      <Formik
        initialValues={{
          name: 'testName',
          image: 'testUrl',
          distributorPrice: {
            amount: 70,
            currency: 'INR'
          },
          sellerPrice: {
            amount: 70,
            currency: 'INR'
          },
          size: ['L'],
          inStock: true,
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
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form
            noValidate
            onSubmit={handleSubmit}
            style={{
              height: '100%'
            }}
          >
            <Grid container xs={12}>
              <Grid item xs={6}>
                {/* @ts-ignore */}
                <FormControl error={Boolean(touched.name && errors.name)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-name-login">Order Name</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-name-order"
                    type="name"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Order Name"
                    inputProps={{}}
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error id="standard-weight-helper-text-name-login">
                      {errors.name}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <InputLabel htmlFor="outlined-adornment-name-login">Order Image</InputLabel>

                <Box flexDirection="row" display="flex" alignItems="center">
                  <input
                    type="file"
                    //@ts-ignore
                    ref={fileRef}
                    name="image"
                    onChange={handleChange}
                    style={{
                      display: 'none'
                    }}
                  />
                  <Button
                    disableElevation
                    size="large"
                    type="submit"
                    variant="contained"
                    color="secondary"
                    //@ts-ignore
                    onClick={() => fileRef.current?.click()}
                  >
                    Upload
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={6} marginTop={'15px'}>
                <InputLabel htmlFor="outlined-adornment-name-login">Distributor </InputLabel>
                <Grid container xs={6} spacing={2}>
                  <Grid item xs={8}>
                    <FormControl
                      error={Boolean(touched.distributorPrice && errors.distributorPrice)}
                      //@ts-ignore
                      sx={{ ...theme.typography.customInput }}
                    >
                      <InputLabel htmlFor="outlined-adornment-name-login">Price</InputLabel>

                      <OutlinedInput
                        id="outlined-adornment-distributor-price-order"
                        type="number"
                        value={values.distributorPrice.amount}
                        name="distributorPrice.amount"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Amount"
                        inputProps={{}}
                        style={{
                          width: '90px'
                        }}
                      />
                      {touched.distributorPrice && errors.distributorPrice && (
                        <FormHelperText error id="standard-weight-helper-text-name-login">
                          {errors.distributorPrice?.amount}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl
                      error={Boolean(touched.distributorPrice && errors.distributorPrice)}
                      //@ts-ignore
                      sx={{ ...theme.typography.customInput }}
                    >
                      <Select
                        id="outlined-adornment-currency-order"
                        value={values.distributorPrice.currency}
                        onBlur={handleBlur}
                        name="distributorPrice.currency"
                        onChange={handleChange}
                        sx={{
                          height: '56px'
                        }}
                      >
                        {currencySupport.map((value) => (
                          <MenuItem value={value}>{value}</MenuItem>
                        ))}
                      </Select>

                      {touched.distributorPrice && errors.distributorPrice && (
                        <FormHelperText error id="standard-weight-helper-text-name-login">
                          {errors.distributorPrice?.amount}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} marginTop={'15px'}>
                <InputLabel htmlFor="outlined-adornment-name-login">Seller Price</InputLabel>
                <Grid container xs={6} spacing={2}>
                  <Grid item xs={8}>
                    <FormControl
                      error={Boolean(touched.sellerPrice && errors.sellerPrice)}
                      //@ts-ignore
                      sx={{ ...theme.typography.customInput }}
                    >
                      <InputLabel htmlFor="outlined-adornment-name-login">Price</InputLabel>

                      <OutlinedInput
                        id="outlined-adornment-seller-price-order"
                        type="number"
                        value={values.sellerPrice.amount}
                        name="sellerPrice.amount"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Amount"
                        inputProps={{}}
                        style={{
                          width: '90px'
                        }}
                      />
                      {touched.sellerPrice && errors.sellerPrice && (
                        <FormHelperText error id="standard-weight-helper-text-name-login">
                          {errors.sellerPrice?.amount}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl
                      error={Boolean(touched.sellerPrice && errors.sellerPrice)}
                      //@ts-ignore
                      sx={{ ...theme.typography.customInput }}
                    >
                      <Select
                        id="outlined-adornment-currency-order"
                        value={values.sellerPrice.currency}
                        label="Currency"
                        onBlur={handleBlur}
                        name="sellerPrice.currency"
                        onChange={handleChange}
                        sx={{
                          height: '56px'
                        }}
                      >
                        {currencySupport.map((value) => (
                          <MenuItem value={value}>{value}</MenuItem>
                        ))}
                      </Select>

                      {touched.sellerPrice && errors.sellerPrice && (
                        <FormHelperText error id="standard-weight-helper-text-name-login">
                          {errors.sellerPrice?.amount}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  error={Boolean(touched.sellerPrice && errors.sellerPrice)}
                  //@ts-ignore
                  sx={{ ...theme.typography.customInput, marginTop: '10px' }}
                >
                  <InputLabel htmlFor="outlined-adornment-name-login">Size</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-seller-price-order"
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.currentTarget.value)}
                    name="Size"
                    onBlur={(e) => handleSaveSize(e, setFieldValue, values)}
                    onClick={(e) => handleSaveSize(e, setFieldValue, values)}
                    label="Size"
                    inputProps={{}}
                    fullWidth
                  />
                  <Box display="flex" flexDirection={'row'} flexWrap="wrap">
                    {(values.size || []).length > 0 &&
                      values.size?.map((value) => (
                        <Box
                          sx={{
                            borderStyle: 'solid',
                            borderWidth: '0.5px',
                            borderRadius: '30px',
                            maxWidth: 'fit-content',
                            padding: '5px',
                            height: '35px',
                            marginTop: '5px'
                          }}
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <label>{value}</label>
                          <IconButton
                            onClick={() => {
                              setFieldValue(
                                'size',
                                values.size?.filter((x) => x !== value)
                              );
                            }}
                          >
                            <MdDeleteOutline />
                          </IconButton>
                        </Box>
                      ))}
                  </Box>
                </FormControl>
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
