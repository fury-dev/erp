import { TChartFilter } from '../../service/controllers';
import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports

// chart data

import { sum } from 'lodash';
import { useApiService } from '../../service';
import { gridSpacing } from '../../store/constant';
import { ITEMS } from '../../types';
import MainCard from '../../ui-component/cards/MainCard';
import SkeletonTotalGrowthBarChart from '../../ui-component/cards/Skeleton/TotalGrowthBarChart';
import { barChartData } from './data';

interface IGenericChart<T extends ITEMS> {
  filter: Omit<TChartFilter, 'dateBy'>;
  columns?: Record<TChartFilter['dateBy'], string[]>;
  items: {
    value: T;
    label: string;
  }[];
  item: ITEMS;
  setItem?: React.Dispatch<React.SetStateAction<ITEMS>>;
  title?: string;
  status?: { value: TChartFilter['dateBy']; label: string }[];
}
const monthCategory = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekCategory = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

const GenericChart = <T extends ITEMS>({
  filter,
  columns = {
    WEEK: weekCategory,
    MONTH: [],
    ALL_TIME: [],
    DAY: [],
    YEAR: monthCategory
  },
  items,
  item,
  setItem,
  title = 'Total',
  status = [
    {
      value: 'DAY',
      label: 'Today'
    },
    {
      value: 'WEEK',
      label: 'Last Week'
    },
    {
      value: 'MONTH',
      label: 'Last Month'
    },
    {
      value: 'YEAR',
      label: 'Last Year'
    },
    {
      value: 'ALL_TIME',
      label: 'All time'
    }
  ]
}: IGenericChart<T>) => {
  const [value, setValue] = useState<TChartFilter['dateBy']>('YEAR');

  const theme = useTheme();
  const {
    chart: { series, updateQuery, loading }
  } = useApiService(item);

  const { primary } = theme.palette.text;
  const darkLight = theme.palette.primary.main;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.info.light;
  const primaryDark = theme.palette.info.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;
  useEffect(() => {
    const newChartData = {
      ...barChartData.options,
      colors: [primary200, primaryDark, secondaryMain, secondaryLight],
      xaxis: {
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
          }
        },
        type: 'category',
        categories: columns[value]
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: {
        borderColor: grey200
      },
      tooltip: {
        theme: 'light'
      },
      legend: {
        labels: {
          colors: grey500
        }
      }
    };

    if (!loading) {
      ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
    }
  }, [primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, loading, grey500, series, columns, value]);

  useEffect(() => {
    updateQuery({ ...filter, dateBy: value });
  }, [filter, updateQuery, value]);
  return (
    <>
      {loading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">{title}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">{sum(series.map((value) => sum(value.data)))}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <TextField
                    id="standard-select-currency"
                    select
                    value={item}
                    onChange={(e) => setItem && setItem(e.target.value as ITEMS)}
                    disabled
                  >
                    {items.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item>
                  <TextField
                    id="standard-select-currency"
                    select
                    value={value}
                    onChange={(e) => setValue(e.target.value as TChartFilter['dateBy'])}
                  >
                    {status.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {/* @ts-ignore */}
              <Chart {...barChartData} series={series as ApexAxisChartSeries} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};
export default GenericChart;
