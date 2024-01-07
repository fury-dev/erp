import orderModel = require("../../schema/mongo/order");
import utils = require("../../schema/mongo/utils");
import lodash = require("lodash");
import orderQuery = require("../query/order");

const addOrder = async (_: any, args: any, context: any) => {
  console.log(context, args);
  if (!context.user) return null;
  const lastOrder = await orderModel.controller
    .find()
    .sort({ _id: -1 })
    .limit(1);

  let orderId = 124594;
  if (lastOrder[0]?.orderId) {
    orderId = lastOrder[0]?.orderId + 1;
  }
  const order = new orderModel.controller({
    orderId,
    ...utils.updateMongo(args.order),
  });

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
  const { order } = args;
  console.log("updating order", order);

  try {
    const data = await orderModel.controller.findByIdAndUpdate(
      order.id,
      utils.updateMongo(order, false, true)
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

const deleteOrder = async (_: any, args: any, context: any) => {
  if (!context.user) return null;
  try {
    console.log("Deleting Order", args);
    const records = (await orderQuery.orders(null, args, context)) as any[];
    console.log("Deleting Order", records);

    return await records?.map(async (record) => {
      return await orderModel.controller.findByIdAndUpdate(
        args.id,
        utils.updateMongo(record, true, true)
      );
    });
  } catch (err) {
    console.error(err);
    return err;
  }
};
export { addOrder, updateOrder, deleteOrder };
