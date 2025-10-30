import { useContext, useCallback } from "react";
import { AuthContext } from "../../models/stores/AuthContext";
import { AuthService } from "../../models/api/authService";

/**
 * Hook que encapsula a lógica de autenticação.
 * Fornece métodos para login, registro, logout e refresh de sessão.
 * @constant register - Função para registrar um novo usuário.
 * @constant login - Função para autenticar um usuário.
 * @constant logout - Função para deslogar o usuário.
 * @constant refreshSession - Função para atualizar a sessão do usuário.
 * @return {Object} Objeto contendo o estado de autenticação e métodos relacionados.
 */
const useAuth = () => {
  const { auth, setAuth, logout, setLoading, setError } = useContext(AuthContext);

  const register = useCallback(
    async (userData) => {
      setError?.(null);
      setLoading?.(true);
      try {
        const created = await AuthService.register(userData);
        setLoading?.(false);
        return created;
      } catch (err) {
        setLoading?.(false);
        setError?.(err.message);
        throw err;
      }
    },
    [setError, setLoading]
  );

  const login = useCallback(
    async (credentials) => {
      setError?.(null);
      setLoading?.(true);
      try {
        const authTokenObj = await AuthService.login(credentials);
        if (!authTokenObj?.token) throw new Error("Token ausente na resposta de login");

        localStorage.setItem("token", authTokenObj.token);

        const me = await AuthService.me(authTokenObj.token);
        const full = { ...me, token: authTokenObj.token };
        setAuth(full);

        setLoading?.(false);
        return full;
      } catch (err) {
        setLoading?.(false);
        setError?.(err.message);
        throw err;
      }
    },
    [setAuth, setError, setLoading]
  );

  const refreshSession = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const me = await AuthService.me(token);
      setAuth({ ...me, token });
    } catch {
      logout?.();
    }
  }, [setAuth, logout]);

  return {
    auth,
    register,
    login,
    logout,
    refreshSession,
  };
}
export { useAuth };