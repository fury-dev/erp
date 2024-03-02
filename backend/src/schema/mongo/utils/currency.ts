export type TCurrency = "INR" | "USD" | "STER";

export const currencySupport: TCurrency[] = ["INR", "STER", "USD"];
// To INR exchangeRate as of 07/01/2024

export const currencySymbol: Record<TCurrency, string> = {
  INR: "₹",
  USD: "$",
  STER: "£",
};
const toExchangeRate = {
  USD: 0.012,
  STER: 0.0094,
  INR: 1,
};

// INR exchangeRate as of 07/01/2024
const fromExchangeRate = {
  USD: 83.1,
  STER: 105.86,
  INR: 1,
};

const convertToINR = (value: number, currency: TCurrency) => {
  return value * fromExchangeRate[currency];
};

const convertFromINR = (value: number, currency: TCurrency) => {
  return value * toExchangeRate[currency];
};
export { convertFromINR, convertToINR };
