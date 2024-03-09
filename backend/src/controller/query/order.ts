import { unpackMessage } from "../../schema/mongo/utils/index";
import orderModel from "../../schema/mongo/order";
import generateQuery from "../../utils/generateQuery";

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

    const preprocess = unpackMessage(response, "product");
    console.log("List Orders", preprocess.length);

    return preprocess;
  } catch (err) {
    console.log(err);
    return err;
  }
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export default { orders };
