import mongoose = require("mongoose");
import common = require("./common");
const ObjectId = mongoose.Schema.ObjectId;

const schema = new mongoose.Schema({
  productId: {
    type: ObjectId,
    required: [true, "Product required"],
  },
  customerName: {
    type: String,
    required: [true, "Customer name required"],
  },
  orderDate: String,
  orderType: String,
  status: String,
  paymentStatus: Boolean,
  deliveryDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  amount: common.Price,
});
const controller = mongoose.model("order", schema);
export { controller, schema };
