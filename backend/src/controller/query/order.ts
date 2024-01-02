import orderModel = require("../../schema/mongo/order");
import utils = require("../../schema/mongo/utils");
import generateQuery = require("../../utils/generateQuery");

const orders = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const response = await generateQuery.generateQuery(
    orderModel.controller,
    args,
    [],
    "id",
    {
      orderId: 1,
    }
  );

  const preprocess = utils.unpackMessage(response);
  console.log("List Orders", preprocess.length);

  return preprocess;
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
