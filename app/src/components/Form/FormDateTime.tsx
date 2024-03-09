import { FormControl, FormHelperText, useTheme } from '@mui/material';
import { DateTimePicker, DateTimeValidationError, PickerChangeHandlerContext } from '@mui/x-date-pickers';
import { IFormField } from './interface';
import dayjs from 'dayjs';

export const FormDateTime = <T,>({
  handleChange,
  touched,
  errors,
  title,
  value,
  name
}: Omit<IFormField<T>, 'handleChange'> & {
  handleChange: ((value: dayjs.Dayjs | null, context: PickerChangeHandlerContext<DateTimeValidationError>) => void) | undefined;
}) => {
  const theme = useTheme();

  return (
    <FormControl
      error={Boolean(touched[name as keyof T] && errors[name as keyof T])}
      //@ts-ignore
      sx={{ ...theme.typography.customInput }}
    >
      <DateTimePicker label={title} onChange={handleChange} value={dayjs(value)} name={name as string} />

      {touched[name as keyof T] && errors[name as keyof T] && (
        <FormHelperText error id="standard-weight-helper-text-name-login">
          {errors[name as keyof T] as string}
        </FormHelperText>
      )}
    </FormControl>
  );
};
