import expenseModel = require("../../schema/mongo/expense");
import lodash = require("lodash");
import generateTimestamp = require("../../utils/generateTimestamp");

const addExpense = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const expense = new expenseModel.controller({ ...args.expense });

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
  const expense = new expenseModel.controller({
    ...lodash.omit(args.expense, "updatetAt"),
    updatedAt: generateTimestamp.generateTimestamp(),
  });

  return await expense.save().catch((err: any) => {
    if (err?.code === 11000) {
      return new Error(err);
    } else {
      return expense;
    }
  });
};

const deleteExpense = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  try {
    expenseModel.controller.findByIdAndDelete(args.id);
    return "success";
  } catch (err) {
    console.error(err);
    return err;
  }
};
export { addExpense, deleteExpense, updateExpense };
