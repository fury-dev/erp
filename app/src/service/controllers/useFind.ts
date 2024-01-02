import { useEffect } from 'react';
import { ITEMS } from '../../types/items';
import { DocumentNode, gql, useQuery } from '@apollo/client';

export const useFind = (item: ITEMS) => {
  const getQuery = (data: DocumentNode, ids: string[]) => gql`
  query ${item}(id:${ids}){
      ${data}
  }
`;
  const {
    loading,
    error,
    data,
    refetch,
    updateQuery: updateGraphQuery,
    fetchMore
  } = useQuery(gql`
  query ${item}s{
      _id
  }
`);

  useEffect(() => {
    if (error) console.error('API error', error);
  }, [error]);
  const updateQuery = (data: DocumentNode, ids: string[]) => {
    updateGraphQuery((_prev) => getQuery(data, ids));
    refetch();
  };

  return {
    loading,
    refetch,
    updateQuery,
    fetchMore,
    data
  };
};
