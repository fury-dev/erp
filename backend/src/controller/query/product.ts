import productModel from "../../schema/mongo/product";
import { unpackMessage } from "../../schema/mongo/utils/index";
import { ObjectId, BSON } from "mongodb";
import generateQuery from "../../utils/generateQuery";

const products = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const match: any[] = [
    {
      deleted: {
        $eq: args.deleted,
      },
    },
  ];
  if ((args?.id || []).length > 0) {
    match.push({
      _id: {
        $in: args.id.map(
          (
            value:
              | string
              | number
              | BSON.ObjectId
              | BSON.ObjectIdLike
              | Uint8Array
              | undefined
          ) => new ObjectId(value)
        ),
      },
    });
  }
  if ((args?.search || "").length > 0) {
    match.push({
      versions: {
        $elemMatch: {
          name: {
            $regex: new RegExp(args.search, "i"),
          },
        },
      },
    });
  }
  const response = await generateQuery.generateQuery(
    productModel.controller,
    args
  );

  const preprocess = unpackMessage(response);
  console.log("List Products", preprocess.length);

  return preprocess;
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
export default { products, productSelection };
