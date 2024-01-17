import mongoose = require("mongoose");
import mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
import filter = require("./filter");

const generateQuery = (
  controller: mongoose.Model<any>,
  args: any,
  piplines: mongoose.PipelineStage[] = [],
  searchElement: string = "name",
  project: mongoose.PipelineStage.Project["$project"] = {}
) => {
  const match: any[] = [];
  const filters: {
    deleted: number;
    id: string[];
    dateBy: filter.TDateby;
    search: string;
    limit: number;
  } = args.filter;
  if (filters && filters.deleted > 0) {
    match.push({
      deleted: {
        $eq: filters.deleted === 2,
      },
    });
  }
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
  if (filters?.dateBy) {
    const { timeSpan } = filter.filterTimeQuery(filters.dateBy);
    if (timeSpan) {
      match.push({
        createdAt: { $gte: timeSpan[0], $lte: timeSpan[1] },
      });
    }
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

    ...((filters?.limit || -1) !== -1
      ? [
          {
            $limit: filters.limit,
          },
        ]
      : []),
  ]);
};
export { generateQuery };
