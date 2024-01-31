import lodash = require("lodash");
import generateTimestamp = require("../../../utils/generateTimestamp");

const updateMongo = (
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

export { updateMongo };

export const unpackMessage = (item: any[], mask?: string, index?: number) => {
  return item.map((value) => {
    const response = lodash.omit(
      value.message[Object.keys(value.message)[0]],
      "_id"
    );
    return {
      ...value,
      ...response,
      ...(mask
        ? {
            [mask]: {
              ...value[mask][0]["versions"][
                index ? index : value[mask][0]["versions"].length - 1
              ],
              id: value[mask][0]._id,
            },
          }
        : {}),

      id: value.id,
      updatedAt: value.updatedAt,
    };
  });
};
