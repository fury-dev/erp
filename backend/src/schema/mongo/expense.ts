import mongoose = require("mongoose");
import common = require("./common");

const schema = new mongoose.Schema({
  deleted: Boolean,
  expenseId: {
    type: Number,
    unique: true,
  },
  versions: [
    {
      cashInBank: common.Price,
      amount: common.Price,
      cashInHand: common.Price,
      expenseType: {
        type: String,
        required: [true, "Expense type is required"],
      },
      versionId: {
        type: Number,
      },
      pnl: common.Price,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      uri: String,
      deleted: Boolean,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const controller = mongoose.model("expense", schema);
export { controller, schema };
