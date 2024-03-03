const Price = {
  currency: {
    type: String,
    required: [true, "Currency required"],
  },
  amount: {
    type: Number,
    required: [true, "amount required"],
  },
};
export default { Price };
