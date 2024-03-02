import orderModel from "../../schema/mongo/order";
import expenseModel from "../../schema/mongo/expense";
import productModel from "../../schema/mongo/productSchema";
import processObjects from "../../utils/processObject";
import generateQuery from "../../utils/generateQuery";
import { unpackMessage } from "../../schema/mongo/utils/index";

export async function getVersionItem(_: any, args: any) {
  let controller;
  const { id, item, version } = processObjects.processId(args.id);
  switch (item) {
    case "order":
      controller = orderModel.controller;
      break;
    case "product":
      controller = productModel.controller;
      break;
    case "expense":
      controller = expenseModel.controller;
      break;
    default:
      throw new Error("Invalid item");
  }

  const response = await generateQuery.generateQuery(
    controller,
    { id: [id] },
    [],
    "",
    [],
    args?.all ? -2 : version
  );

  return {
    versions: response[0].versions.map((_value: any, index: number) =>
      unpackMessage(response, undefined, index)
    ),
  };
}
