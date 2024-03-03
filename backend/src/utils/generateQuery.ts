import mongoose from "mongoose";
import { TFilter } from "../types/utils";
import { createMongoFilter } from "./filter";

const generateQuery = (
  controller: mongoose.Model<any>,
  args: any,
  piplines: mongoose.PipelineStage[] = [],
  searchElement: string = "name",
  project: mongoose.PipelineStage.Project["$project"] = {},
  version: number = -1
) => {
  const filter: TFilter = args.filter;
  const match = createMongoFilter(filter, searchElement);
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
        ...(version !== -2
          ? { message: { $slice: ["$versions", version] } }
          : {}),
        id: "$_id",
        ...project,
      },
    },

    ...((filter?.limit || -1) !== -1
      ? [
          {
            $limit: filter.limit,
          },
        ]
      : []),
  ]);
};
export default { generateQuery };
