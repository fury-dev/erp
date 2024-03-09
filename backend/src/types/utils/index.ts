export type TFilter = {
  deleted: number;
  id: string[];
  dateBy: TDateby;
  search: string;
  limit: number;
  dynamicQuery: any;
};
export type TDateby = "MONTH" | "ALL_TIME" | "YEAR" | "DAY" | "WEEK";
