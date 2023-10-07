import { useState, useEffect } from 'react';
import useToken from './useToken';

export default function useUserInternal() {
  const { token, setToken, removeToken } = useToken();

  const getPayloadFromToken = (token: string) => {
    const encodedPayload = token.split('.')[1];
    return JSON.parse(atob(encodedPayload));
  };

  const logOut = (token: string) => {
    removeToken();
  };

  const [user, setUser] = useState(() => {
    if (!token) return null;
    return getPayloadFromToken(token as string);
  });

  useEffect(() => {
    if (!token) {
      setUser(null);
    } else {
      setUser(getPayloadFromToken(token as string));
    }
  }, [token]);

  return { user, setToken, logOut };
}
