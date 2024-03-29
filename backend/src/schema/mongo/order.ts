import mongoose from "mongoose";
import common from "./common";
const ObjectId = mongoose.Schema.ObjectId;

const schema = new mongoose.Schema({
  deleted: Boolean,
  orderId: {
    type: Number,
    unique: true,
  },
  versions: [
    {
      productId: {
        type: ObjectId,
        required: [true, "Product required"],
      },
      versionId: {
        type: Number,
      },
      customerName: {
        type: String,
        required: [true, "Customer name required"],
      },
      deleted: Boolean,
      orderDate: String,
      orderType: String,
      status: String,
      paymentStatus: Boolean,
      amount: common.Price,
      deliveryDate: { type: Date, default: Date.now },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      uri: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const controller = mongoose.model("order", schema);
export default { controller, schema };
