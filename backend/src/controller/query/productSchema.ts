import productSchemaModel from "../../schema/mongo/productSchema";
import generateQuery from "../../utils/generateQuery";
import { unpackMessage } from "../../schema/mongo/utils/index";

const productSchemas = async (_: any, args: any, context: any) => {
  if (!context.user) return null;

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
