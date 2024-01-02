import { gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export type Register = {
  email: string;
  password: string;
  username: string;
};
export const userRegister = () => {
  const { setUser } = useAuthContext();
  const [data, setData] = useState<any>();
  const [apiErrors, setApiErrors] = useState<any>();

  const navigate = useNavigate();

  let value = {
    email: 'test',
    password: 'test',
    username: 'test'
  };
  const [regitserUser, { loading, error, data: res }] = useMutation(
    gql`
      mutation Register($user: UserRegisterValue!) {
        registerUser(user: $user)
      }
    `,
    {
      variables: {
        user: value
      }
    }
  );

  useEffect(() => {
    if (error) console.error('API error', error, res);
  }, [error, res]);

  const submitQuery = async (value: Register) => {
    console.log(res, data, error, value);

    if (data) {
      setData(null);
    }
    await regitserUser({
      variables: {
        user: value
      }
    });
    console.log(res, data, error);
    if (res) {
      const response = JSON.parse(res?.registerUser);
      if (response?.success?.auth?.token) {
        const { auth, user } = response?.success;
        setData(response?.success);
        setUser(user);
        await localStorage.setItem('authToken', JSON.stringify(auth));
        console.log('Route to dashboard');
        navigate('/home');
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
