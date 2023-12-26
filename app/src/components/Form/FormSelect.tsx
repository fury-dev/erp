import { FormControl, InputLabel, Select, MenuItem, FormHelperText, useTheme } from '@mui/material';
import { IFormField } from './interface';

interface IFormSelect<T> extends IFormField<T> {
  options: string[];
}
export const FormSelect = <T,>({ handleChange, touched, errors, title, value, name, options }: IFormSelect<T>) => {
  const theme = useTheme();
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
          height: '56px'
        }}
      >
        {options.map((value) => (
          <MenuItem value={value}>{value}</MenuItem>
        ))}
      </Select>

      {touched[name as keyof T] && errors[name as keyof T] && (
        <FormHelperText error id="standard-weight-helper-text-name-login">
          {errors[name as keyof T] as string}
        </FormHelperText>
      )}
    </FormControl>
  );
};
