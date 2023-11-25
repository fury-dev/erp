import productModel = require("../../schema/mongo/product");
import lodash = require("lodash");
import generateTimestamp = require("../../utils/generateTimestamp");

const addProduct = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const product = new productModel.controller({ ...args.product });

  return await product.save().catch((err: any) => {
    if (err?.code === 11000) {
      return new Error(err);
    } else {
      return product;
    }
  });
};
const updateProduct = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const product = new productModel.controller({
    ...lodash.omit(args.product, "updatetAt"),
    updatedAt: generateTimestamp.generateTimestamp(),
  });

  return await product.save().catch((err: any) => {
    if (err?.code === 11000) {
      return new Error(err);
    } else {
      return product;
    }
  });
};

const deleteProduct = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  try {
    productModel.controller.findByIdAndDelete(args.id);
    return "success";
  } catch (err) {
    console.error(err);
    return err;
  }
};
export { addProduct, deleteProduct, updateProduct };
