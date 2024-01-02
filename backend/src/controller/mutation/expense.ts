import expenseModel = require("../../schema/mongo/expense");
import utils = require("../../schema/mongo/utils");
import lodash = require("lodash");
import expenseQuery = require("../query/expense");

const addExpense = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const lastExpense = await expenseModel.controller
    .find()
    .sort({ _id: -1 })
    .limit(1);
  const data = args.expense;
  console.log(data, lastExpense);
  data["pnl"] = {
    amount:
      (data.cashInHand?.amount || 0) +
      (data.cashInBank?.amount || 0) +
      ((data.operationType === "DEBIT" ? -data.amount?.amount : 0) || 0),
    currency: "INR",
  };

  let expenseId = 124594;
  if (lastExpense.length === 1 && lastExpense[0]?.expenseId) {
    expenseId = lastExpense[0]?.expenseId + 1;
    const lastExpenseVersion =
      lastExpense[0]?.versions[lastExpense[0].versions.length];
    data["pnl"].amount -= lastExpense[0]
      ? (lastExpenseVersion?.cashInHand?.amount || 0) +
        (lastExpenseVersion?.cashInBank?.amount || 0) +
        (lastExpenseVersion?.amount?.amount || 0)
      : 1;
  }

  const expense = new expenseModel.controller({
    expenseId,
    ...utils.updateMongo(data),
  });
  return await expense.save().catch((err: any) => {
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
      utils.updateMongo(expense, false, true)
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

    return await records?.map(async (record) => {
      return await expenseModel.controller.findByIdAndUpdate(
        args.id,
        utils.updateMongo(record, true, true)
      );
    });
  } catch (err) {
    console.error(err);
    return err;
  }
};
export { addExpense, deleteExpense, updateExpense };
