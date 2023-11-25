import mongoose = require("mongoose");
import common = require("./common");

const Schema = new mongoose.Schema({
  distributorPrice: common.Price,
  sellerPrice: common.Price,
  size: String,
  createdAt: { type: Date, default: Date.now },
});
const controller = mongoose.model("product", Schema);
export { controller };
