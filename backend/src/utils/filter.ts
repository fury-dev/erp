import moment = require("moment");

type TDateby = "MONTH" | "ALL_TIME" | "YEAR" | "DAY" | "WEEK";

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

export { filterTimeQuery, TDateby };
