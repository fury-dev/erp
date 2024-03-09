import lodash from "lodash";
import generateTimestamp from "../../../utils/generateTimestamp";
import mongoose from "mongoose";

export const updateMongo = (
  item: any,
  deleted: boolean = false,
  isUpdate: boolean = false
) =>
  isUpdate
    ? {
        $push: {
          versions: {
            ...lodash.omit(
              lodash.omit(lodash.omit(item, "versionId"), "updatedAt"),
              "id"
            ),
            versionId: (parseInt(item?.versionId) || 1) + 1,
            deleted,
          },
        },
        $set: {
          deleted,
          createdAt: generateTimestamp.generateTimestamp(),
          updatedAt: generateTimestamp.generateTimestamp(),
        },
      }
    : {
        deleted,
        versions: [{ ...item, deleted }],
        createdAt: generateTimestamp.generateTimestamp(),
        updatedAt: generateTimestamp.generateTimestamp(),
      };

export const unpackMessage = (item: any[], mask?: string, index?: number) => {
  return item.map((value) => {
    const response = lodash.omit(
      value.message[Object.keys(value.message)[0]],
      "_id"
    );
    return {
      ...lodash.omit(value, "message"),
      ...response,
      ...(mask
        ? {
            [mask]: {
              ...value[mask][0]["versions"][
                index ? index : value[mask][0]["versions"].length - 1
              ],
              ...lodash.omit(
                value[mask][0],
                "_id",
                "createdAt",
                "updatedAt",
                "versions"
              ),
              id: value[mask][0]._id,
            },
          }
        : {}),

      id: value.id,
      updatedAt: value.updatedAt,
    };
  });
};
export const isObjectId = (value: string) =>
  mongoose.Types.ObjectId.isValid(value);
export const StringToObjectId = (value: string) =>
  new mongoose.Types.ObjectId(value);

export default { updateMongo, unpackMessage };
