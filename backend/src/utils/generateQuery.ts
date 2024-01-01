import mongoose = require("mongoose");
import mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

const generateQuery = (
  controller: mongoose.Model<any>,
  filters: any,
  piplines: mongoose.PipelineStage[] = [],
  searchElement: string = "name",
  project: mongoose.PipelineStage.Project["$project"] = {}
) => {
  const match: any[] = [
    {
      deleted: {
        $eq: filters.deleted,
      },
    },
  ];
  if ((filters?.id || []).length > 0) {
    match.push({
      _id: {
        $in: filters.id.map(
          (
            value:
              | string
              | number
              | mongodb.BSON.ObjectId
              | mongodb.BSON.ObjectIdLike
              | Uint8Array
              | undefined
          ) => new ObjectId(value)
        ),
      },
    });
  }
  if ((filters?.search || "").length > 0) {
    match.push({
      versions: {
        $elemMatch: {
          [searchElement]: {
            $regex: new RegExp(filters.search, "i"),
          },
        },
      },
    });
  }

  return controller.aggregate([
    ...(match.length > 1
      ? [
          {
            $match: {
              $and: match,
            },
          },
        ]
      : [
          {
            $match: {
              ...match[0],
            },
          },
        ]),
    ...piplines,
    {
      $project: {
        updatedAt: 1,
        message: { $slice: ["$versions", -1] },
        id: "$_id",
        ...project,
      },
    },
  ]);
};
export { generateQuery };
