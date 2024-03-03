import orderModel from "../../schema/mongo/order";
import lodash from "lodash";
import orderQuery from "../query/order";
import processObject from "../../utils/processObject";
import { updateMongo } from "../../schema/mongo/utils/index";

const addOrder = async (_: any, args: any, context: any) => {
  console.log(context, args);
  if (!context.user) return null;
  const data = processObject.preProcessCurrency(args.order, ["amount"]);
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
    ...updateMongo(data),
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
      updateMongo(order, false, true)
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
        updateMongo(record, true, true)
      );
    });
  } catch (err) {
    console.error(err);
    return err;
  }
};
export default { addOrder, updateOrder, deleteOrder };
