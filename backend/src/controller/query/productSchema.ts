import productSchemaModel from "../../schema/mongo/productSchema";
import generateQuery from "../../utils/generateQuery";
import { unpackMessage } from "../../schema/mongo/utils/index";
import { ObjectId, BSON } from "mongodb";

const productSchemas = async (_: any, args: any, context: any) => {
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
    productSchemaModel.controller,
    args,
    [],
    "",
    { productSchemaId: 1 }
  );

  const preprocess = unpackMessage(response);
  console.log("List ProductSchemas", preprocess.length);

  return preprocess;
};
const productSchemaSelection = (
  _: any,
  args: {
    id: string;
  },
  context: any
) => {
  if (!context.user) return null;
  try {
    return productSchemaModel.controller.find({
      _id: {
        $in: args.id,
      },
    });
  } catch (err) {
    console.error(err);
    return {};
  }
};
export default { productSchemas };
