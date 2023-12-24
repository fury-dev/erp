import orderModel = require("../../schema/mongo/order");
import utils = require("../../schema/mongo/utils");
const addOrder = async (_: any, args: any, context: any) => {
  console.log(context, args);
  if (!context.user) return null;
  const order = new orderModel.controller(utils.updateMongo(args.order));

  return await order.save().catch((err: any) => {
    if (err?.code === 11000) {
      return new Error(err);
    } else {
      return order;
    }
  });
};

const updateOrder = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  // const order = new orderModel.controller({
  //   ...lodash.omit(args.order, "updatetAt"),
  //   updatedAt: generateTimestamp.generateTimestamp(),
  // });
  const { order } = args;
  try {
    orderModel.controller.findByIdAndUpdate(
      order.id,
      utils.updateMongo(order, false, true)
    );
    return order;
  } catch (err: any) {
    return new Error(err);
  }
};

const deleteOrder = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  try {
    const record = await orderModel.controller.findById(args.id);

    orderModel.controller.findByIdAndUpdate(
      args._id,
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
export { addOrder, updateOrder, deleteOrder };
