import orderModel = require("../../schema/mongo/order");
import utils = require("../../schema/mongo/utils");
import expenseModel = require("../../schema/mongo/expense");
import productModel = require("../../schema/mongo/product");
import mongoose = require("mongoose");
import moment = require("moment");
type TChart = {
  status: string;
  total: number;
  timeFrame: string | number;
};

type TDateby = "MONTH" | "ALL_TIME" | "YEAR" | "DAY" | "WEEK";

const fill: Record<TDateby, number> = {
  ALL_TIME: 1,
  DAY: 24,
  MONTH: 31,
  WEEK: 7,

  YEAR: 12,
};
const preprocessTimeSeries = (data: TChart[], dateBy: TDateby) => {
  const dataByStatus: Record<string, TChart[]> = {};

  data.forEach((value) => {
    if (!Object.keys(dataByStatus).includes(value.status)) {
      dataByStatus[value.status] = [];
    }

    dataByStatus[value.status].push(value);
  });

  const timeSeries: {
    name: string;
    data: number;
  }[] = [];
  Object.keys(dataByStatus).map((value) => {
    const time = {
      name: value,
      //@ts-ignore
      data: dataByStatus[value].sort((a, b) =>
        a.timeFrame > b.timeFrame ? 1 : a.timeFrame < b.timeFrame ? -1 : 0
      ),
    };

    const xdata: number[] = new Array(fill[dateBy]).fill(0);

    time.data.forEach((item) => {
      xdata[item.timeFrame as number] = item.total;
    });

    //@ts-ignore
    time.data = xdata;
    //@ts-ignore
    timeSeries.push(time);
  });
  return timeSeries;
};
const chartData = async (_: any, args: any, context: any) => {
  let createSeries = "status";

  let controller: mongoose.Model<any> = orderModel.controller;
  if (args.filter.item === "product") {
    createSeries = "inStock";
    controller = productModel.controller;
  } else if (args.filter.item === "expense") {
    createSeries = "operationType";
    controller = expenseModel.controller;
  }
  let timeSpan;
  const date = new Date();
  let timeFilter: string | undefined = undefined;
  if (args.filter.dateBy === "MONTH") {
    timeFilter = "dayOfMonth";
    timeSpan = [moment(date).subtract("1", "month").toDate(), date];
  } else if (args.filter.dateBy === "YEAR") {
    timeFilter = "month";

    timeSpan = [moment(date).subtract("1", "year").toDate(), date];
  } else if (args.filter.dateBy === "DAY") {
    timeFilter = "hour";

    timeSpan = [moment(date).subtract("24", "hours").toDate(), date];
  } else if (args.filter.dateBy === "WEEK") {
    timeFilter = "dayOfWeek";

    timeSpan = [moment(date).subtract("7", "days").toDate(), date];
  }

  const data: TChart[] = await controller.aggregate([
    ...((timeSpan || [])?.length === 2
      ? [
          {
            $match: {
              createdAt: { $gte: timeSpan![0], $lte: timeSpan![1] },
            },
          },
        ]
      : []),
    {
      $project: {
        status: { $arrayElemAt: ["$versions.status", -1] },
        createdAt: 1,
      },
    },
    {
      $group: {
        _id: {
          status: "$" + createSeries,
          ...(timeFilter
            ? {
                [timeFilter]: {
                  ["$" + timeFilter]: "$createdAt",
                },
              }
            : {}), // Extract month from orderDate
        },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id." + createSeries,
        ...(timeFilter ? { timeFrame: "$_id." + timeFilter } : {}),
        total: 1,
      },
    },
  ]);
  console.log(data);
  const preprocess = preprocessTimeSeries(data, args.filter.dateBy);
  console.log(JSON.stringify(preprocess));
  return preprocess;
};

export { chartData };
