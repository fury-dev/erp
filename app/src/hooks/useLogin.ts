import { getApolloContext, gql, useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export type Login = {
  email: string;
  password: string;
};
export const useLogin = () => {
  const [data, setData] = useState<any>();
  const [apiErrors, setApiErrors] = useState<any>();
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  const value = {
    email: 'test',
    password: 'test'
  };
  const [loginUser, { loading, error, data: res, client }] = useMutation(
    gql`
      mutation Login($user: UserLoginValue!) {
        loginUser(user: $user)
      }
    `,
    {
      variables: {
        user: value
      }
    }
  );

  useEffect(() => {
    if (error) console.error('API error', error);
    console.log(client, res);
    console.log(getApolloContext());
  }, [error, res, client]);

  useEffect(() => {
    if (res) {
      console.log(res);
      const response = JSON.parse(res?.loginUser);
      if (response?.success?.auth?.token) {
        const { auth, user } = response.success;
        setData(response?.success);

        setUser(user);
        localStorage.setItem('authToken', JSON.stringify(auth));
        navigate('/home');
      } else {
        setApiErrors(response?.error);
      }
    }
  }, [navigate, res, setUser]);
  const updateQuery = useCallback(
    async (value: Login) => {
      await loginUser({
        variables: {
          user: value
        }
      });
    },
    [loginUser]
  );

  return {
    loading,
    error,
    data,
    updateQuery,
    apiErrors
  };
};
