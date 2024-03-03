import { DialogBox } from '../../../components/Dialog/DialogBox';
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton } from '@mui/material';
import { Formik } from 'formik';
import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MdDeleteOutline } from 'react-icons/md';
import { useState } from 'react';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import { useProductSchema } from './hooks/useProductSchema';
import { ProductSchema } from '../../../types/items/product';
import { FormInputMoney } from '../../../components/Form';
import { Price } from '../../../types';
import { useDialogContext } from '../../../context/useDialogContext';

export const ProductSchemaSetup = ({
  open,
  onClose,
  productSchema
}: {
  open: boolean;
  onClose: () => void;
  productSchema?: ProductSchema;
}) => {
  const theme = useTheme();
  const [size, setSize] = useState('');
  const { submitData } = useProductSchema();
  const { setOpen } = useDialogContext();
  const handleSaveSize = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    setFieldValue: (arg0: string, arg1: any[]) => void,
    values: ProductSchema
  ) => {
    if (!values.size?.includes(size) && size) {
      setFieldValue('size', [...(values?.size || []), size]);
      setSize('');
    }
  };
  console.log(productSchema);
  return (
    <DialogBox title="ProductSchema" open={open} onClose={() => setOpen(false)} width="600px">
      <Formik<ProductSchema>
        initialValues={{
          name: 'testName',
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
          ...(productSchema || {})
        }}
        // validate={validation}
        onSubmit={async (values) => {
          try {
            if (values) await submitData(values as ProductSchema);
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
            <Grid container xs={12} columnGap={2}>
              <Grid item xs={12}>
                {/* @ts-ignore */}
                <FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-name-login">ProductSchema Name</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-name-productSchema"
                    type="name"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="ProductSchema Name"
                    inputProps={{}}
                    fullWidth
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error id="standard-weight-helper-text-name-login">
                      {errors.name}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={5} marginTop={'15px'}>
                <FormInputMoney<ProductSchema>
                  title="Distributor Price"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  pricefield="distributorPrice.amount"
                  currencyField="distributorPrice.currency"
                  value={values.distributorPrice as Price}
                />
              </Grid>
              <Grid item xs={5} marginTop={'15px'}>
                <FormInputMoney<ProductSchema>
                  title="Seller Price"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  pricefield="sellerPrice.amount"
                  currencyField="sellerPrice.currency"
                  value={values.sellerPrice as Price}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  error={Boolean(touched.sellerPrice && errors.sellerPrice)}
                  //@ts-ignore
                  sx={{ ...theme.typography.customInput, marginTop: '10px' }}
                >
                  <InputLabel htmlFor="outlined-adornment-name-login">Size</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-seller-price-productSchema"
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.currentTarget.value)}
                    name="Size"
                    onBlur={(e) => values && handleSaveSize(e, setFieldValue, values!)}
                    onClick={(e) => values && handleSaveSize(e, setFieldValue, values!)}
                    label="Size"
                    inputProps={{}}
                    fullWidth
                  />
                  <Box display="flex" flexDirection={'row'} flexWrap="wrap">
                    {(values.size || []).length > 0 &&
                      values.size?.map((value, index) => (
                        <Box
                          key={index.toString()}
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
                <FormControlLabel
                  name="inStock"
                  onChange={(e) => {
                    //@ts-ignore
                    e.currentTarget.value = e.currentTarget.value === 'checked';
                    handleChange(e);
                  }}
                  value={values.inStock ? 'checked' : false}
                  control={<Checkbox name="inStock" value={values.inStock ? 'checked' : false} />}
                  label="In Stock"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  {values.id ? 'Update' : 'Add'} ProductSchema
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </DialogBox>
  );
};
