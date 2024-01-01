import productModel = require("../../schema/mongo/product");
import utils = require("../../schema/mongo/utils");
import mongodb = require("mongodb");
import generateQuery = require("../../utils/generateQuery");
const ObjectId = mongodb.ObjectId;

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
              | mongodb.BSON.ObjectId
              | mongodb.BSON.ObjectIdLike
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

  const preprocess = utils.unpackMessage(response);
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
export { products };
