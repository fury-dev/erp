import productModel = require("../../schema/mongo/product");
import lodash = require("lodash");
import generateTimestamp = require("../../utils/generateTimestamp");
import utils = require("../../schema/mongo/utils");

const addProduct = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const product = new productModel.controller(utils.updateMongo(args.product));

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
  // const product = new productModel.controller({
  //   ...lodash.omit(args.product, "updatetAt"),
  //   updatedAt: generateTimestamp.generateTimestamp(),
  // });
  const { product } = args;

  try {
    productModel.controller.findByIdAndUpdate(
      product.id,
      utils.updateMongo(product)
    );
    return product;
  } catch (err: any) {
    return new Error(err);
  }
};

const deleteProduct = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  try {
    const record = await productModel.controller.findById(args.id);

    productModel.controller.findByIdAndUpdate(
      args.id,
      utils.updateMongo(
        record?.versions[record.versions.length - 1] || {},
        true
      )
    );
    return "success";
  } catch (err) {
    console.error(err);
    return err;
  }
};
export { addProduct, deleteProduct, updateProduct };
