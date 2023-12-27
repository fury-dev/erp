import { FormControl, InputLabel, Select, MenuItem, FormHelperText, useTheme } from '@mui/material';
import { IFormField } from './interface';
import { useEffect } from 'react';
import { TQueryParams } from '../../service/controllers';

interface IFormSelect<T> extends IFormField<T> {
  options?: (string | { label: string; value: string })[];
  apiAction?: (params: TQueryParams | any) => void;
}
export const FormSelect = <T,>({ handleChange, touched, errors, title, value, name, options = [], sx, apiAction }: IFormSelect<T>) => {
  const theme = useTheme();
  useEffect(() => {
    if (apiAction) {
      apiAction({});
    }
  }, [apiAction]);

  useEffect(() => {
    if (!value && options.length > 0) {
      handleChange({
        target: {
          value: typeof options[0] === 'string' ? options[0] : options[0].value
        }
      });
    }
  }, [value]);
  return (
    <FormControl
      error={Boolean(touched[name as keyof T] && errors[name as keyof T])}
      //@ts-ignore
      sx={{ ...theme.typography.customInput }}
    >
      <InputLabel htmlFor="outlined-adornment-name-login">{title}</InputLabel>

      <Select
        id="outlined-adornment-currency-order"
        onBlur={handleChange}
        label={title}
        onChange={handleChange}
        value={value}
        name={name as string}
        sx={{
          height: '56px',
          ...sx
        }}
      >
        {options.map((value) => {
          if (typeof value === 'string') {
            return <MenuItem value={value}>{value}</MenuItem>;
          } else {
            return <MenuItem value={value.value}>{value.label}</MenuItem>;
          }
        })}
      </Select>

      {touched[name as keyof T] && errors[name as keyof T] && (
        <FormHelperText error id="standard-weight-helper-text-name-login">
          {errors[name as keyof T] as string}
        </FormHelperText>
      )}
    </FormControl>
  );
};
