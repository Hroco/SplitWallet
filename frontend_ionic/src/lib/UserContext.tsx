import React, { createContext, useContext } from 'react';
import useUserInternal from '../hooks/useUserInternal';

const UserContext = createContext<any>(null);

export function useUser() {
  return useContext(UserContext);
}

type UserProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export function UserProvider({ children }: UserProviderProps) {
  const { user, setToken, logOut } = useUserInternal();

  return (
    <UserContext.Provider value={{ user, setToken, logOut }}>
      {children}
    </UserContext.Provider>
  );
}
