import expenseModel = require("../../schema/mongo/expense");

const expenses = (_: any, _x: any, context: any) => {
  if (!context.user) return null;
  return expenseModel.controller.find({});
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
    return expenseModel.controller.find({
      _id: {
        $in: args.id,
      },
    });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export { expenses, expenseSelection };
