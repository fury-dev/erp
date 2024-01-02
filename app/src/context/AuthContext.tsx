import { ReactNode, createContext, useCallback, useContext, useEffect } from 'react';
import { User } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setAuthUser } from '../store/reducers';
import { gql, useQuery } from '@apollo/client';

type IAuthContext = {
  setUser: (value: User | null) => void;
  user: User | null;
};

const AuthContext = createContext<IAuthContext | null>(null);
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const setUser = (value: User | null) => {
    dispatch(setAuthUser(value));
  };
  const authToken = localStorage.getItem('authToken');
  const { data, refetch, error } = useQuery(
    gql`
      query UserQuery($token: String) {
        userValidation(token: $token) {
          email
          username
        }
      }
    `,
    {
      variables: {
        //@ts-ignore
        token: authToken ? JSON.parse(authToken)?.token : ''
      }
    }
  );

  const userValidation = useCallback(async () => {
    console.log('fetch');
    await refetch();
  }, [refetch, data, setUser, error]);

  useEffect(() => {
    userValidation();
  }, []);

  useEffect(() => {
    if (data) {
      setUser(data.userValidation);
    } else if (error) {
      console.log(error);
    }
  }, [data]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext)!;
