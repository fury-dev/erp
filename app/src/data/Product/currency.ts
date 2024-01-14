import { TCurrency } from '../../types';

export const currencySupport: TCurrency[] = ['INR', 'STER', 'USD'];
// To INR exchangeRate as of 07/01/2024

export const currencySymbol: Record<TCurrency, string> = {
  INR: '₹',
  USD: '$',
  STER: '£'
};
const toExchangeRate = {
  USD: 0.0120336943441637,
  STER: 0.0094464386926129,
  INR: 1
};

// INR exchangeRate as of 07/01/2024
const fromExchangeRate = {
  USD: 83.1,
  STER: 105.86,
  INR: 1
};

export const convertToINR = (value: number, currency: TCurrency) => {
  return value * fromExchangeRate[currency];
};

export const convertFromINR = (value: number, currency: TCurrency) => {
  return value * toExchangeRate[currency];
};
