import orderModel = require("../../schema/mongo/order");
import lodash = require("lodash");
import generateTimestamp = require("../../utils/generateTimestamp");
const addOrder = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  const order = new orderModel.controller({ ...args.order });

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
  const order = new orderModel.controller({
    ...lodash.omit(args.order, "updatetAt"),
    updatedAt: generateTimestamp.generateTimestamp(),
  });

  return await order.save().catch((err: any) => {
    if (err?.code === 11000) {
      return new Error(err);
    } else {
      return order;
    }
  });
};

const deleteOrder = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  try {
    orderModel.controller.findByIdAndDelete(args.id);
    return "success";
  } catch (err) {
    console.error(err);
    return err;
  }
};
export { addOrder, updateOrder, deleteOrder };
