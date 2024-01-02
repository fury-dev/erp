import { useQuery } from '@apollo/client';

export const useGraphQL = () => {
  const { loading, error, data, refetch, updateQuery } = useQuery();

  return {
    loading,
    error,
    data,
    refetch,
    updateQuery
  };
};
