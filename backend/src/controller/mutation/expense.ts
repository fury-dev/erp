import expenseModel = require("../../schema/mongo/expense");
import utils = require("../../schema/mongo/utils");

const addExpense = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const expense = new expenseModel.controller(utils.updateMongo(args.expense));

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
  try {
    await expenseModel.controller.findByIdAndUpdate(
      expense.id,
      utils.updateMongo(expense, true)
    );
  } catch (err) {
    return new Error("Db Err");
  }
};

const deleteExpense = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  try {
    const record = await expenseModel.controller.findById(args.id);

    expenseModel.controller.findByIdAndUpdate(
      args.id,
      utils.updateMongo(
        record?.versions[record.versions.length - 1] || {},
        true
      )
    );
    return "success";
  } catch (err) {
    console.error(err);
    return err;
  }
};
export { addExpense, deleteExpense, updateExpense };
