import { useCallback, useMemo, useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { AuthContext } from './AuthContext';
import { decodeJwt } from '../utils/decodeJwt';
import { AUTH_STORAGE_KEY } from '../config/appConfig';

function loadStoredUser() {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return null;
    }
    const user = JSON.parse(raw);

    return user.expiresAt > Date.now() ? user : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  const login = useCallback((credential) => {
    const payload = decodeJwt(credential);
    const nextUser = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      expiresAt: payload.exp * 1000,
    };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    googleLogout();
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
