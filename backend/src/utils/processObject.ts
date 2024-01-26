import config = require("../config.json");
const fromExchangeRate = {
  USD: 83.1,
  STER: 105.86,
  INR: 1,
};
export type TCurrency = "INR" | "USD" | "STER";

const toExchangeRate = {
  USD: 0.0120336943441637,
  STER: 0.0094464386926129,
  INR: 1,
};

type TAmount = {
  amount: number;
  currency: TCurrency;
};
const convertToINR = (
  value: number,
  currency: keyof typeof fromExchangeRate
) => {
  return value * fromExchangeRate[currency];
};
const convertFromINR = (
  value: number,
  currency: keyof typeof toExchangeRate
) => {
  return value * toExchangeRate[currency];
};
const preProcessCurrency = (data: object, mask: string[]) => {
  mask.map((value) => {
    const dataValue: TAmount = data[value as keyof typeof data] as TAmount;
    //@ts-ignore
    data[value as keyof typeof data] = {
      ...dataValue,
      amount: convertFromINR(
        convertToINR(dataValue.amount, dataValue.currency),
        config.database.currency as TCurrency
      ),
    };
  });
  return data;
};

const processId = (id: string) => {
  const values = id.split(":");
  if (values.length === 1) {
    throw new Error("Invalid Id");
  }
  return {
    id: values[0],
    item: values[1],
    version: values.length > 2 ? parseInt(values[2]) : -1,
  };
};
export { preProcessCurrency, processId };
