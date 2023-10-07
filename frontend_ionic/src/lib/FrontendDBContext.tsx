import React, { createContext, useContext } from 'react';
import useBrowserBackend, {
  BrowserBackendFunctions,
} from '../hooks/useBrowserBackend';

const FrontendDBContext = createContext<BrowserBackendFunctions>(
  {} as BrowserBackendFunctions
);

export function useDBFunctions() {
  const backendFunctions = useContext(FrontendDBContext);
  return backendFunctions;
}

type FrontendDBProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export function FrontendDBProvider({ children }: FrontendDBProviderProps) {
  const backendFunctions = useBrowserBackend();

  return (
    <FrontendDBContext.Provider value={backendFunctions}>
      {children}
    </FrontendDBContext.Provider>
  );
}
