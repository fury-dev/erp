import React, { ReactNode, createContext, useState } from 'react';
import { User } from '../types';

type IAuthContext = {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  user: User | null;
};

const AuthContext = createContext<IAuthContext | null>(null);
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

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
