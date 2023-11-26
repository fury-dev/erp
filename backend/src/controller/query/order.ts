import orderModel = require("../../schema/mongo/order");
import utils = require("../../schema/mongo/utils");

const orders = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const response = await orderModel.controller.aggregate([
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

const orderSelection = (
  _: any,
  args: {
    id: string;
  },
  context: any
) => {
  if (!context.user) return null;
  try {
    return orderModel.controller.aggregate([
      {
        $match: {
          _id: {
            $in: args.id,
          },
        },
      },
      {
        $lookup: {
          from: "product",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
    ]);
  } catch (err) {
    console.error(err);
    return {};
  }
};

export { orders };
