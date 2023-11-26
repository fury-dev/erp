import lodash = require("lodash");
import generateTimestamp = require("../../../utils/generateTimestamp");

const updateMongo = (item: object, deleted: boolean = false) => ({
  deleted,

  versions: {
    "$push ": {
      ...lodash.omit(item, "id"),
      deleted,
    },
  },
  createdAt: generateTimestamp.generateTimestamp(),
  updatedAt: generateTimestamp.generateTimestamp(),
});

export { updateMongo };

export const unpackMessage = (item: any[]) =>
  item.map((value) => ({ ...value.message, id: value.id }));
