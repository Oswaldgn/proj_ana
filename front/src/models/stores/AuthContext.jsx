import { createContext, useEffect, useState } from "react";

/**
 * Contexto de autenticação
 * @module AuthContext - Contexto para gerenciar autenticação do usuário.
 */
const AuthContext = createContext({
  auth: null,
  setAuth: () => {},
  logout: () => {},
  loading: false,
  error: null,
});

const STORAGE_KEY = "app_auth_v1";

/**
 * Provedor de contexto de autenticação
 * @param {Object} props - Propriedades do componente.
 * @returns {JSX.Element} Componente provedor de contexto de autenticação.
 */
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (auth) localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [auth]);

  const logout = () => {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, loading, setLoading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthProvider };