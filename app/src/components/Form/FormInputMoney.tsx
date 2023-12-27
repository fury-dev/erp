import { Box, FormControl, FormHelperText, FormLabel, OutlinedInput, useTheme } from '@mui/material';
import { IFormField } from './interface';
import { FormSelect } from '.';
import { currencySupport } from '../../data/Product/currency';
import { Price } from '../../types';

interface IFormInputMoney<T> extends Omit<IFormField<T>, 'name'> {
  pricefield: string;
  currencyField: string;
  value: Price;
}
export const FormInputMoney = <T,>({ handleChange, touched, errors, title, value, pricefield, currencyField }: IFormInputMoney<T>) => {
  const theme = useTheme();

  return (
    <FormControl
      error={Boolean(touched[pricefield as keyof T] && errors[pricefield as keyof T])}
      //@ts-ignore
      sx={{ ...theme.typography.customInput, alignItems: 'start', padding: 0 }}
    >
      <FormLabel htmlFor="outlined-adornment-name-login"> {title}</FormLabel>
      <Box display="flex" flexDirection="row" alignItems="center">
        <OutlinedInput
          id="outlined-adornment-seller-price-order"
          type="number"
          value={value.amount}
          name={pricefield}
          onBlur={handleChange}
          onChange={handleChange}
          //   label="Amount"
          style={{
            width: '90px',
            borderRight: '0'
          }}
        />
        <FormSelect<T>
          title=""
          name={currencyField}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          options={currencySupport}
          value={value.currency}
          sx={{
            width: '90px'
          }}
        />
      </Box>
      {touched[pricefield as keyof T] && errors[pricefield as keyof T] && (
        <FormHelperText error id="standard-weight-helper-text-name-login">
          {errors[pricefield as keyof T] as string}
        </FormHelperText>
      )}
    </FormControl>
  );
};
