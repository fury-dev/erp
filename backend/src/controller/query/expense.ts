import expenseModel = require("../../schema/mongo/expense");
import utils = require("../../schema/mongo/utils");

const expenses = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const response = await expenseModel.controller.aggregate([
    ...((args.id || []).length > 0
      ? [
          {
            $match: {
              _id: { $in: args.id },
            },
          },
        ]
      : []),
    {
      $project: {
        message: { $slice: ["$yourArray", -1] },
        id: "$_id",
      },
    },
  ]);
  return utils.unpackMessage(response);
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
