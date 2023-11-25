import productModel = require("../../schema/mongo/product");

const products = (_: any, _x: any, context: any) => {
  if (!context.user) return null;
  return productModel.controller.find({});
};
const productSelection = (
  _: any,
  args: {
    id: string;
  },
  context: any
) => {
  if (!context.user) return null;
  try {
    return productModel.controller.find({
      _id: {
        $in: args.id,
      },
    });
  } catch (err) {
    console.error(err);
    return {};
  }
};
export { products, productSelection };
