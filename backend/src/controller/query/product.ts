import productModel = require("../../schema/mongo/product");
import utils = require("../../schema/mongo/utils");
import mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

const products = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const response = await productModel.controller.aggregate([
    ...((args.id || []).length > 0
      ? [
          {
            $match: {
              $and: [
                {
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
                },
                {
                  deleted: {
                    $eq: false,
                  },
                },
              ],
            },
          },
        ]
      : [
          {
            $match: {
              deleted: {
                $eq: false,
              },
            },
          },
        ]),
    {
      $project: {
        updatedAt: 1,
        message: { $slice: ["$versions", -1] },
        id: "$_id",
      },
    },
  ]);
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
