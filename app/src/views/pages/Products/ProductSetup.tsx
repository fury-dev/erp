import { DialogBox } from '../../../components/Dialog/DialogBox';
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton } from '@mui/material';
import { Formik } from 'formik';
import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MdCancel } from 'react-icons/md';
import { LegacyRef, useEffect, useRef, useState } from 'react';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import { useProduct } from './hooks/useProduct';
import { Product, ProductSchema } from '../../../types/items/product';
import { FormInputMoney, FormSelect } from '../../../components/Form';
import { Price } from '../../../types';
import { useDialogContext } from '../../../context/DialogContext';
import { useApiService } from '../../../service';

export const ProductSetup = ({ open, onClose, product }: { open: boolean; onClose: () => void; product?: Product }) => {
  const theme = useTheme();
  const [showImage, setShowImage] = useState<boolean>(false);
  const {
    list: {
      updateMask,
      data: { productSchemas }
    }
  } = useApiService<ProductSchema>('productSchema');
  const { submitData } = useProduct();
  const { setOpen } = useDialogContext();
  const fileRef = useRef<LegacyRef<HTMLInputElement>>(null);
  const handleImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (arg0: string, arg1: any) => void,
    _values: Product
  ) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = async () => {
        setFieldValue('image', convertToPNG(fileReader.result));
        console.log(await convertToPNG(fileReader.result));
      };
      await fileReader.readAsDataURL(file);
    }
    setOpen(true);
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
    return image.src;
  };

  useEffect(() => {
    updateMask(`id
    name
    sizes`);
  }, [updateMask]);
  return (
    <DialogBox title="Product" open={open} onClose={() => setOpen(false)} width="600px">
      <Formik<Product>
        initialValues={{
          name: 'testName',
          image: '',
          productSchemaId: undefined,
          price: {
            amount: 70,
            currency: 'INR'
          },
          size: '',
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
            <DialogBox title="image" open={showImage} onClose={() => setShowImage(false)} width="600px">
              <Box
                sx={{
                  position: 'relative'
                }}
              >
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 0
                  }}
                  onClick={() => setShowImage(false)}
                >
                  <MdCancel />
                </IconButton>
                <img src={values.image || ''} />
              </Box>
            </DialogBox>
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
                    variant="contained"
                    color="secondary"
                    //@ts-ignore
                    onClick={() => fileRef.current?.click()}
                  >
                    Upload
                  </Button>
                  {values.image && (
                    <Button disableElevation size="large" variant="contained" color="secondary" onClick={() => setShowImage(true)}>
                      View
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item xs={6} marginTop={'15px'}>
                <FormInputMoney<Product>
                  title="Price"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  pricefield="price.amount"
                  currencyField="price.currency"
                  value={values.price as Price}
                />
              </Grid>
              <Grid item xs={6}>
                <FormSelect<Product>
                  title="Product Schema"
                  name="productSchemaId"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  options={productSchemas.map((value) => ({
                    label: value.name,
                    value: value.id
                  }))}
                  value={values.size}
                />
              </Grid>
              <Grid item xs={6}>
                <FormSelect<Product>
                  title="Size"
                  name="size"
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  options={(productSchemas.find((value) => value.id === values.productSchemaId)?.size || []).map((value) => ({
                    label: value,
                    value
                  }))}
                  value={values.size}
                />
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
