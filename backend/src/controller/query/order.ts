import orderModel = require("../../schema/mongo/order");

const orders = (_: any, _x: any, context: any) => {
  if (!context.user) return null;
  return orderModel.controller.find({});
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

export { orders, orderSelection };
