import productModel = require("../../schema/mongo/product");
import lodash = require("lodash");
import generateTimestamp = require("../../utils/generateTimestamp");
import utils = require("../../schema/mongo/utils");
import productQuery = require("../query/product");
import processObject = require("../../utils/processObject");

const addProduct = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  try {
    console.log(args.product);
    const lastProduct = await productModel.controller
      .find()
      .sort({ _id: -1 })
      .limit(1);
    const data: any = processObject.preProcessCurrency(args.product, ["price"]);

    let productId = 124594;
    if (lastProduct.length === 1 && lastProduct[0]?.productId) {
      productId = lastProduct[0]?.productId + 1;
    }
    const product = new productModel.controller({
      productId,
      productSchemaId: data?.productSchemaId,
      ...lodash.omit(utils.updateMongo(data), "productSchemaId"),
    });
    return await product
      .save()
      .then((res) => {
        const data = res.toJSON();
        console.log("Product  Saved");

        return {
          ...lodash.omit(data.versions[0], "_id"),
          updatedAt: data.updatedAt,
          id: res.id,
        };
      })
      .catch((err: any) => {
        console.log(err);
        if (err?.code === 11000) {
          return new Error(err);
        }
      });
  } catch (err) {
    console.log(err);
  }
};
const updateProduct = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const { product } = args;
  console.log("updating product", product);

  try {
    const data = await productModel.controller.findByIdAndUpdate(
      product.id,
      utils.updateMongo(product, false, true)
    );

    return {
      ...lodash.omit(data?.versions[data?.versions.length - 1], "_id"),
      updatedAt: data?.updatedAt,
      objectId: data?.id,
    };
  } catch (err: any) {
    return new Error(err);
  }
};

const deleteProduct = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  try {
    console.log("Deleting Products", args);
    const records = await productQuery.products(null, args, context);

    return await records?.map(async (record) => {
      return await productModel.controller.findByIdAndUpdate(
        args.id,
        utils.updateMongo(record, true, true)
      );
    });
  } catch (err) {
    console.error(err);
    return err;
  }
};
export { addProduct, deleteProduct, updateProduct };
