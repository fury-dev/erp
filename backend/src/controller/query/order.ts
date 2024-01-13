import orderModel = require("../../schema/mongo/order");
import utils = require("../../schema/mongo/utils");
import generateQuery = require("../../utils/generateQuery");

const orders = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  console.log(args);
  try {
    const response = await generateQuery.generateQuery(
      orderModel.controller,
      args,
      [
        {
          $lookup: {
            from: "products",
            localField: "versions.productId",
            foreignField: "_id",
            as: "product",
          },
        },
      ],
      "id",
      {
        orderId: 1,
        product: 1,
      }
    );

    const preprocess = utils.unpackMessage(response, "product");
    console.log("List Orders", preprocess.length);

    return preprocess;
  } catch (err) {
    console.log(err);
    return err;
  }
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
          localField: "versions.productId",
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
