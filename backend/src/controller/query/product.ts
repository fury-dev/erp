import productModel from "../../schema/mongo/product";
import { unpackMessage } from "../../schema/mongo/utils/index";
import { ObjectId, BSON } from "mongodb";
import generateQuery from "../../utils/generateQuery";

const products = async (_: any, args: any, context: any) => {
  if (!context.user) return null;

  const response = await generateQuery.generateQuery(
    productModel.controller,
    args,
    [
      {
        $lookup: {
          from: "productschemas",
          foreignField: "_id",
          localField: "productSchemaId",
          as: "productSchema",
        },
      },
    ],
    undefined,
    {
      productSchema: 1,
      productId: 1,
    }
  );
  const preprocess = unpackMessage(response, "productSchema");
  console.log("List Products", preprocess.length);

  return preprocess;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
export default { products };
