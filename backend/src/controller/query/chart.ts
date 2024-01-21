import orderModel = require("../../schema/mongo/order");
import utils = require("../../schema/mongo/utils");
import expenseModel = require("../../schema/mongo/expense");
import productModel = require("../../schema/mongo/product");
import mongoose = require("mongoose");
import moment = require("moment");
import filter = require("../../utils/filter");
type TChart = {
  status: string;
  total: number;
  timeFrame: string | number;
  value: any;
  createdAt: String;
};

export type ITEMS = "order" | "expense" | "product";

const fill: Record<filter.TDateby, number> = {
  ALL_TIME: 1,
  DAY: 24,
  WEEK: 7,
  YEAR: 12,
  MONTH: 0,
};
const preprocessTimeSeries = (
  data: TChart[],
  dateBy: filter.TDateby,
  itemType: ITEMS
) => {
  const dataByStatus: Record<string, TChart[]> = {};

  data.forEach((value) => {
    if (!Object.keys(dataByStatus).includes(value.status)) {
      dataByStatus[value.status] = [];
    }
    // TODO: to be removed
    value.total += parseInt((Math.random() * 100).toFixed(0));
    dataByStatus[value.status].push(value);
  });

  const timeSeries: {
    name: string;
    data: number;
  }[] = [];
  Object.keys(dataByStatus).map((value) => {
    const time = {
      name:
        value !== "undefined"
          ? value
          : dateBy === "MONTH"
          ? moment(
              new Date(dataByStatus[value][0].createdAt as string),
              "YYYY-MM-DD"
            ).format("MMM")
          : dateBy === "YEAR"
          ? moment(
              new Date(dataByStatus[value][0].createdAt as string),
              "YYYY-MM-DD"
            ).format("YYYY")
          : dataByStatus[value][0].timeFrame?.toString(),
      //@ts-ignore
      data: dataByStatus[value].sort((a, b) =>
        a.timeFrame > b.timeFrame ? 1 : a.timeFrame < b.timeFrame ? -1 : 0
      ),
      value: 0,
    };

    const xdata: number[] = new Array(
      dateBy === "MONTH"
        ? //@ts-ignore
          moment(dataByStatus[value][0].createdAt, "YYYY-MM-DD").daysInMonth()
        : fill[dateBy]
    ).fill(0);
    let data = itemType === "order" || itemType === "expense" ? 0 : [0, 0];
    time.data.forEach((item) => {
      xdata[(item.timeFrame as number) - 1] = item.total;
    });

    //@ts-ignore
    time.data = xdata;
    //@ts-ignore
    time.value = JSON.stringify(data);
    //@ts-ignore
    timeSeries.push(time);
  });
  return timeSeries;
};
const chartData = async (_: any, args: any, context: any) => {
  let createSeries = args.filter.group;
  console.log(args.filter, "filter");

  let controller: mongoose.Model<any> = orderModel.controller;
  if (args.filter.item === "product") {
    controller = productModel.controller;
  } else if (args.filter.item === "expense") {
    controller = expenseModel.controller;
  }

  const { timeFilter, timeSpan } = filter.filterTimeQuery(args.filter.dateBy);
  let match: any = undefined;

  if (args.id?.[0] && timeSpan) {
    match = {
      $and: [
        { createdAt: { $gte: timeSpan![0], $lte: timeSpan![1] } },
        { id: { $in: args.id } },
      ],
    };
  } else if (timeSpan)
    match = { createdAt: { $gte: timeSpan![0], $lte: timeSpan![1] } };
  else if (args.id?.[0]) {
    match = {
      [args?.query ? `$version.${args?.query}` : "id"]: { $in: args.id },
    };
  }
  console.log(match, "x");
  try {
    const data: TChart[] = await controller.aggregate([
      ...(match
        ? [
            {
              $match: match,
            },
          ]
        : []),
      {
        $project: {
          versions: {
            $arrayElemAt: ["$versions", -1],
          },
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: {
            ...(createSeries
              ? { [createSeries]: "$versions." + createSeries }
              : {}),
            ...(timeFilter
              ? {
                  [timeFilter]: {
                    ["$" + timeFilter]: "$createdAt",
                  },
                }
              : {}),
          },

          total: { $sum: 1 },
          createdAt: { $first: "$createdAt" },
        },
      },
      {
        $project: {
          _id: 0,
          [createSeries]: "$_id." + createSeries,
          ...(timeFilter ? { timeFrame: "$_id." + timeFilter } : {}),
          total: 1,
          createdAt: 1,
          product: 1,
        },
      },
    ]);
    const preprocess = preprocessTimeSeries(
      data,
      args.filter.dateBy,
      args.filter.item
    );
    return preprocess;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export { chartData };
