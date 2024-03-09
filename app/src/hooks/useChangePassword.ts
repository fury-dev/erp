import { gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export type Password = {
  newPassword: string;
  newPasswordAgain: string;
};
export const useChangePassword = () => {
  const { setUser } = useAuthContext();
  const [data, setData] = useState<any>();
  const [apiErrors, setApiErrors] = useState<any>();

  const navigate = useNavigate();

  const value = {
    email: 'test',
    password: 'test'
  };
  const [regitserUser, { loading, error, data: res }] = useMutation(
    gql`
      mutation ChangePassword($data: PasswordValue!) {
        changePassword(data: $data) {
          email
        }
      }
    `,
    {
      variables: {
        data: value
      }
    }
  );

  useEffect(() => {
    if (error) console.error('API error', error, res);
  }, [error, res]);

  const submitQuery = async (value: { password: string; email: string }) => {
    if (data) {
      setData(null);
    }
    await regitserUser({
      variables: {
        data: value
      }
    });
    if (res) {
      const response = JSON.parse(res?.registerUser);
      if (response?.success?.auth?.token) {
        setData(response?.success);
        setUser(null);
        await localStorage.removeItem('authToken');
        navigate('/');
      } else {
        setApiErrors(response?.error);
      }
    }
  };
  return {
    loading,
    error,
    apiErrors,
    data,
    submitQuery
  };
};
