import { useMutation, gql } from '@apollo/client';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export const useGoogleLogin = () => {
  let value = {
    credentials: 'test'
  };
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  const [loginUser, { data: res }] = useMutation(
    gql`
      mutation Login($credentials: String!) {
        loginWithGoogle(credentials: $credentials)
      }
    `,
    {
      variables: {
        credentials: value
      }
    }
  );
  useEffect(() => {
    if (res) {
      console.log(res);
      const response = JSON.parse(res?.loginWithGoogle);
      if (response?.success?.auth?.token) {
        const { auth, user } = response?.success;

        setUser(user);
        localStorage.setItem('authToken', JSON.stringify(auth));
        navigate('/home');
      }
    }
  }, [res]);
  const loginWithGoogle = useCallback(async (credentials: string) => {
    loginUser({
      variables: {
        credentials
      }
    });
  }, []);

  return {
    loginWithGoogle
  };
};
