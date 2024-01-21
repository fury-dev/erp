import { DialogBox } from '../../../components/Dialog/DialogBox';
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, MenuItem, Select } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { currencySupport } from '../../../data/Product/currency';
import { MdDeleteOutline } from 'react-icons/md';
import { LegacyRef, useRef, useState } from 'react';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import { useProduct } from './hooks/useProduct';
import { Product } from '../../../types/items/product';
import { FormInputMoney } from '../../../components/Form';
import { Price } from '../../../types';

const validation = Yup.object().shape({
  name: Yup.string().required()
});
export const ProductSetup = ({ open, onClose, product }: { open: boolean; onClose: () => void; product?: Product }) => {
  const theme = useTheme();
  const [size, setSize] = useState('');
  const [showImage, setShowImage] = useState<boolean>(false);
  const { submitData } = useProduct();
  const fileRef = useRef<LegacyRef<HTMLInputElement>>(null);
  const handleSaveSize = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    setFieldValue: (arg0: string, arg1: any[]) => void,
    values: Product
  ) => {
    if (!values.size?.includes(size) && size) {
      setFieldValue('size', [...(values?.size || []), size]);
      setSize('');
    }
  };
  const handleImage = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (arg0: string, arg1: any) => void, values: Product) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setFieldValue('image', convertToPNG(fileReader.result));
      };
      fileReader.readAsDataURL(file);
    }
  };
  const convertToPNG = (base64String: string | ArrayBuffer | null) => {
    const image = new Image();
    image.src = base64String as string;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      if (ctx) ctx.drawImage(image, 0, 0);

      const pngDataUrl = canvas.toDataURL('image/png');

      return pngDataUrl;
    };
  };
  return (
    <DialogBox title="Product" open={open} onClose={onClose} width="600px">
      <Formik<Product>
        initialValues={{
          name: 'testName',
          image: undefined,
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
          ...(product || {})
        }}
        // validate={validation}
        onSubmit={async (values, {}) => {
          try {
            if (values) await submitData(values as Product);
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
                  <InputLabel htmlFor="outlined-adornment-name-login">Product Name</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-name-product"
                    type="name"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Product Name"
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
                <InputLabel htmlFor="outlined-adornment-name-login">Product Image</InputLabel>

                <Box flexDirection="row" display="flex" alignItems="center">
                  <input
                    type="file"
                    //@ts-ignore
                    ref={fileRef}
                    name="image"
                    onChange={(e) => handleImage(e, setFieldValue, values)}
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
                  {values.image && (
                    <Button
                      disableElevation
                      size="large"
                      type="submit"
                      variant="contained"
                      color="secondary"
                      onClick={() => setShowImage(true)}
                    >
                      View
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item xs={6} marginTop={'15px'}>
                <FormInputMoney<Product>
                  title="Distributor Price"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  pricefield="distributorPrice.amount"
                  currencyField="distributorPrice.currency"
                  value={values.distributorPrice as Price}
                />
              </Grid>
              <Grid item xs={6} marginTop={'15px'}>
                <FormInputMoney<Product>
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
                    id="outlined-adornment-seller-price-product"
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
                  {values.id ? 'Update' : 'Add'} Product
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </DialogBox>
  );
};
