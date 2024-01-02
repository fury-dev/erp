import expenseModel = require("../../schema/mongo/expense");
import utils = require("../../schema/mongo/utils");
import generateQuery = require("../../utils/generateQuery");

const expenses = async (_: any, args: any, context: any) => {
  const response = await generateQuery.generateQuery(
    expenseModel.controller,
    args,
    [],
    "id",
    {
      expenseId: 1,
    }
  );

  const preprocess = utils.unpackMessage(response);
  console.log("List Expense", preprocess.length);

  return preprocess;
};
const expenseSelection = (
  _: any,
  args: {
    id: string;
  },
  context: any
) => {
  if (!context.user) return null;

  try {
    return expenseModel.controller.aggregate();
  } catch (err) {
    console.error(err);
    return err;
  }
};

export { expenses };
