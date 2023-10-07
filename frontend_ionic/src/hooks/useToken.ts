import { useState } from 'react';

export default function useToken() {
  const [token, setTokenInternal] = useState<string>(() => {
    return localStorage.getItem('token') as string;
  });

  function setToken(newToken: string) {
    localStorage.setItem('token', newToken);
    setTokenInternal(newToken);
  }

  function removeToken() {
    localStorage.removeItem('token');
    setTokenInternal('');
  }

  return { token, setToken, removeToken };
}
