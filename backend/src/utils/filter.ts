import { isObjectId, StringToObjectId } from "../schema/mongo/utils";
import { TDateby, TFilter } from "../types/utils";
import { ObjectId, BSON } from "mongodb";
import moment from "moment";

const filterTimeQuery = (dateBy: TDateby) => {
  let timeSpan;
  const date = new Date();
  let timeFilter: string | undefined = undefined;
  if (dateBy === "MONTH") {
    timeFilter = "dayOfMonth";
    timeSpan = [moment(date).subtract("1", "month").toDate(), date];
  } else if (dateBy === "YEAR") {
    timeFilter = "month";

    timeSpan = [moment(date).subtract("1", "year").toDate(), date];
  } else if (dateBy === "DAY") {
    timeFilter = "hour";

    timeSpan = [moment(date).subtract("24", "hours").toDate(), date];
  } else if (dateBy === "WEEK") {
    timeFilter = "dayOfWeek";

    timeSpan = [moment(date).subtract("7", "days").toDate(), date];
  } else {
    timeFilter = "month";
  }

  return {
    timeFilter,
    timeSpan,
  };
};

export const createMongoFilter = (args: TFilter, searchElement: string) => {
  const match: any[] = [];
  const filters: {
    deleted: number;
    id: string[];
    dateBy: TDateby;
    search: string;
    limit: number;
    dynamicQuery: any;
  } = args;
  if (filters && filters.deleted > 0) {
    match.push({
      deleted: {
        $eq: filters.deleted === 2,
      },
    });
  }

  if (filters?.dynamicQuery) {
    const item = JSON.parse(filters?.dynamicQuery);
    match.push(
      ...Object.keys(item).map((key) => {
        return {
          [key]: {
            ...(Array.isArray(item[key])
              ? {
                  $in: item[key].map((value: any) =>
                    isObjectId(value) ? StringToObjectId(value) : value
                  ),
                }
              : {
                  $eq: isObjectId(item[key])
                    ? StringToObjectId(item[key])
                    : item[key],
                }),
          },
        };
      })
    );
  } else if ((filters?.id || []).length > 0) {
    match.push({
      _id: {
        $in: filters.id.map(
          (
            value:
              | string
              | number
              | BSON.ObjectId
              | BSON.ObjectIdLike
              | Uint8Array
              | undefined
          ) => new ObjectId(value)
        ),
      },
    });
  }
  if (filters?.dateBy) {
    const { timeSpan } = filterTimeQuery(filters.dateBy);
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
  return match;
};
export default { filterTimeQuery };
