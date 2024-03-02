import expenseModel from "../../schema/mongo/expense";
import lodash from "lodash";
import expenseQuery from "../query/expense";
import processObject from "../../utils/processObject";
import { updateMongo } from "../../schema/mongo/utils/index";
const addExpense = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const lastExpense = await expenseModel.controller
    .find()
    .sort({ _id: -1 })
    .limit(1);
  const data = processObject.preProcessCurrency(args.expense, [
    "cashInBank",
    "cashInHand",
    "amount",
  ]);

  // data["pnl"] = {
  //   amount:
  //     (data.cashInHand?.amount || 0) +
  //     (data.cashInBank?.amount || 0) +
  //     ((data.operationType === "DEBIT" ? -data.amount?.amount : 0) || 0),
  //   currency: "INR",
  // };

  let expenseId = 124594;
  if (lastExpense.length === 1 && lastExpense[0]?.expenseId) {
    expenseId = lastExpense[0]?.expenseId + 1;
    const _lastExpenseVersion =
      lastExpense[0]?.versions[lastExpense[0].versions.length];
    // data["pnl"].amount -= lastExpense[0]
    //   ? (lastExpenseVersion?.cashInHand?.amount || 0) +
    //     (lastExpenseVersion?.cashInBank?.amount || 0) +
    //     (lastExpenseVersion?.amount?.amount || 0)
    //   : 1;
  }

  const expense = new expenseModel.controller({
    expenseId,
    ...updateMongo(data),
  });
  return await expense.save().catch((err: any) => {
    if (err) console.log(err);
    if (err?.code === 11000) {
      return new Error(err);
    } else {
      return expense;
    }
  });
};

const updateExpense = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const { expense } = args;
  console.log("updating oexpenserder", expense);

  try {
    const data = await expenseModel.controller.findByIdAndUpdate(
      expense.id,
      updateMongo(expense, false, true)
    );

    return {
      ...lodash.omit(data?.versions[data?.versions.length - 1], "_id"),
      updatedAt: data?.updatedAt,
      objectId: data?.id,
    };
  } catch (err: any) {
    return new Error(err);
  }
};

const deleteExpense = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  try {
    console.log("Deleting Expense", args);
    const records = await expenseQuery.expenses(null, args, context);
    console.log("Deleting Expense", records);

    return await records?.map(async (record: any) => {
      return await expenseModel.controller.findByIdAndUpdate(
        args.id,
        updateMongo(record, true, true)
      );
    });
  } catch (err) {
    console.error(err);
    return err;
  }
};
export default { addExpense, deleteExpense, updateExpense };
