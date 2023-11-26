import productModel = require("../../schema/mongo/product");
import utils = require("../../schema/mongo/utils");

const products = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const response = await productModel.controller.aggregate([
    ...((args.id || []).length > 0
      ? [
          {
            $match: {
              _id: { $in: args.id },
            },
          },
        ]
      : []),
    {
      $project: {
        message: { $slice: ["$yourArray", -1] },
        id: "$_id",
      },
    },
  ]);
  return utils.unpackMessage(response);
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
export { products };
