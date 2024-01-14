import { useCallback, useEffect, useState } from 'react';
import { ITEMS } from '../../types/items';
import { gql, useQuery } from '@apollo/client';
const POLLING_INTERVAL = 10000;
export type TChartFilter = {
  dateBy: 'MONTH' | 'YEAR' | 'DAY' | 'ALL_TIME' | 'WEEK';
  item: ITEMS;
  group?: string;
};
export type TChartData = {
  name: string;
  data: number[];
  value: any;
};

export const useChart = () => {
  let query = gql`
    query Chart($filter: Filter) {
      chartData(filter: $filter) {
        name
        data
        value
      }
    }
  `;

  const [series, setSeries] = useState<TChartData[]>([]);
  const {
    loading,
    error,
    data,
    refetch,
    updateQuery: _updateGraphQuery,
    fetchMore,
    startPolling,
    stopPolling
  } = useQuery(query, {
    variables: {
      filter: {
        item: 'order',
        dateBy: 'ALL_TIME',
        group: 'status'
      }
    }
  });

  useEffect(() => {
    if (error) console.error('API error', error);
  }, [error]);

  useEffect(() => {
    console.log(data);
    if (data?.chartData) setSeries(data.chartData);
  }, [data]);

  const updateQuery = useCallback(async (filter: TChartFilter) => {
    stopPolling();
    await refetch({
      filter
    });
    startPolling(POLLING_INTERVAL);
  }, []);
  return {
    loading,
    refetch,
    updateQuery,
    fetchMore,
    data,
    startPolling,
    stopPolling,
    series
  };
};
