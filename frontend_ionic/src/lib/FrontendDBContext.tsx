import React, { createContext, useContext } from 'react';
import useDBHandler, { BackendFunctions } from '../hooks/useDBHandler';

const DBContext = createContext<BackendFunctions>({} as BackendFunctions);

export function useDBFunctions() {
  const backendFunctions = useContext(DBContext);
  return backendFunctions;
}

type DBProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export function DBProvider({ children }: DBProviderProps) {
  const backendFunctions = useDBHandler();

  return (
    <DBContext.Provider value={backendFunctions}>{children}</DBContext.Provider>
  );
}
