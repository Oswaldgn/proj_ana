import { ApiFactory } from "../../models/interface/ApiFactory";

const AUTH_BASE = "http://localhost:8080/api/auth/"; // ajuste porta/backend se necessário
const USERS_BASE = "http://localhost:8080/api/users/";

/**
 * Tenta analisar a resposta como JSON.
 * @param {Response} response - A resposta da requisição.
 * @returns {Promise<Object|null>} O corpo da resposta como objeto JSON ou null.
 * @throws {Error} Se a análise falhar.
 */
async function parseJsonSafe(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

/**
 * Serviço de autenticação para registro, login e obtenção de dados do usuário.
 * @namespace AuthService
 * @property {Function} register - Registra um novo usuário.
 * @property {Function} login - Autentica um usuário e obtém o token.
 * @property {Function} me - Obtém os dados do usuário autenticado.
 * @property {Function} updateMe - Atualiza os dados do usuário autenticado.
 * @returns {Object} Objeto contendo os métodos do serviço de autenticação.
 */
export const AuthService = {
  register: async (userData) => {
    try {
      const res = await fetch(`${AUTH_BASE}register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const payload = await parseJsonSafe(res);
      if (!res.ok) {
        const errorMsg = payload?.message || payload?.error || JSON.stringify(payload) || res.statusText;
        throw new Error(`Registratio failed: ${errorMsg}`);
      }
      return ApiFactory.createAuthFromRegisterResponse(payload);
    } catch (err) {
      throw new Error(err.message ?? "Erro desconhecido ao registrar");
    }
  },

  login: async (credentials) => {
    try {
      const res = await fetch(`${AUTH_BASE}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const payload = await parseJsonSafe(res);
      if (!res.ok) {
        const msg = payload?.message || payload?.error || JSON.stringify(payload) || res.statusText;
        throw new Error(`Login failed: ${msg}`);
      }
      return ApiFactory.createAuthFromLoginResponse(payload);
    } catch (err) {
      throw new Error(err.message ?? "Erro desconhecido ao logar");
    }
  },

  me: async (token) => {
    try {
      const res = await fetch(`${USERS_BASE}me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await parseJsonSafe(res);
      if (!res.ok) {
        const msg = payload?.message || payload?.error || JSON.stringify(payload) || res.statusText;
        throw new Error(`Falha ao obter usuário: ${msg}`);
      }
      return ApiFactory.createAuthFromMeResponse({ ...payload, token });
    } catch (err) {
      throw new Error(err.message ?? "Erro desconhecido ao buscar usuário");
    }
  },

    updateMe: async (token, userData) => {
    try {
      const res = await fetch(`${USERS_BASE}me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const payload = await parseJsonSafe(res);
      if (!res.ok) {
        const msg = payload?.message || payload?.error || JSON.stringify(payload) || res.statusText;
        throw new Error(`Falha ao atualizar usuário: ${msg}`);
      }

      return ApiFactory.createAuthFromMeResponse({ ...payload, token });
    } catch (err) {
      throw new Error(err.message ?? "Erro desconhecido ao atualizar usuário");
    }
  },
};
