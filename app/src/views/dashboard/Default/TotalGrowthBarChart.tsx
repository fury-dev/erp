import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from '../../../ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';

// chart data
import chartData from './chart-data/total-growth-bar-chart';
import { useApiService } from '../../../service';
import { TChartFilter } from '../../../service/controllers';
import { ITEMS } from '../../../types';
import { sum } from 'lodash';

const monthCategory = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekCategory = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

const columns: Record<TChartFilter['dateBy'], string[]> = {
  WEEK: weekCategory,
  MONTH: [],
  ALL_TIME: [],
  DAY: [],
  YEAR: monthCategory
};

const items: {
  value: ITEMS;
  label: string;
}[] = [
  {
    value: 'expense',
    label: 'Expense'
  },
  {
    value: 'order',
    label: 'Order'
  },
  {
    value: 'product',
    label: 'Product'
  }
];

const status: {
  value: TChartFilter['dateBy'];
  label: string;
}[] = [
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
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }: any) => {
  const [value, setValue] = useState<TChartFilter['dateBy']>('YEAR');
  const [item, setItem] = useState<ITEMS>('order');

  const theme = useTheme();
  const {
    chart: { series, updateQuery }
  } = useApiService('order');

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
      ...chartData.options,
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

    // do not load chart when loading
    if (!isLoading) {
      ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
    }
  }, [primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500, series]);

  useEffect(() => {
    updateQuery({
      dateBy: value,
      item: item,
      group: 'status'
    });
  }, [value, item]);
  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">Total {items.find((value) => value.value === item)?.label}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">{sum(series.map((value) => sum(value.data)))}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <TextField id="standard-select-currency" select value={item} onChange={(e) => setItem(e.target.value as ITEMS)} disabled>
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
              <Chart {...chartData} series={series as ApexAxisChartSeries} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
