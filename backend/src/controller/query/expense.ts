import { unpackMessage } from "../../schema/mongo/utils/index";
import expenseModel from "../../schema/mongo/expense";
import generateQuery from "../../utils/generateQuery";

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

  const preprocess = unpackMessage(response);
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

export default { expenses };
