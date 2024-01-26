import orderModel = require("../../schema/mongo/order");
import utils = require("../../schema/mongo/utils");
import expenseModel = require("../../schema/mongo/expense");
import productModel = require("../../schema/mongo/product");
import processObjects = require("../../utils/processObject");
import generateQuery = require("../../utils/generateQuery");

const getVersionItem = async (_: any, args: any) => {
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
    version
  );
  const preprocess = utils.unpackMessage(response);

  return preprocess[0];
};
export { getVersionItem };
