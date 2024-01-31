import mongoose = require("mongoose");
import common = require("./common");

const Schema = new mongoose.Schema({
  deleted: Boolean,
  productSchemaId: {
    type: Number,
    unique: true,
  },
  versions: [
    {
      name: String,
      versionId: {
        type: Number,
        default: 1,
      },
      distributorPrice: common.Price,
      sellerPrice: common.Price,
      size: [String],
      inStock: Boolean,
      image: String,
      createdAt: { type: Date, default: Date.now },
      deleted: Boolean,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const controller = mongoose.model("productSchema", Schema);
export { controller };
