import { FormikHandlers, FormikTouched, FormikErrors } from 'formik';
import { CSSProperties } from 'react';

export interface IFormField<T> {
  handleChange: FormikHandlers['handleChange'];
  touched: FormikTouched<T>;
  value: any;
  name: keyof T | string;
  title: string;
  errors: FormikErrors<T>;
  sx?: CSSProperties;
}
