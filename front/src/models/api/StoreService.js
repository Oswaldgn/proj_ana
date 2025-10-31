const API_URL = "http://localhost:8080/api/store";

/**
 * Serviço para interagir com a API de lojas do usuário.
 * Fornece métodos para buscar, criar, atualizar e deletar lojas vinculadas ao usuário autenticado.
 * @param {Object}  getAllStores - Busca todas as lojas do usuário autenticado.
 * @param {Object}  create - Cria uma nova loja vinculada ao usuário autenticado.
 * @param {Object}  update - Atualiza uma loja existente (apenas se o usuário for o proprietário).
 * @param {Object}  remove - Remove uma loja específica (apenas se o usuário for o dono).
 * @param {Object}  getById - Busca os detalhes de uma loja específica pelo ID.
 * @returns {Object} Objeto com métodos para interagir com a API de lojas do usuário.
 */
export const StoreService = {

  getMyStores: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      const response = await fetch(`${API_URL}/my`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar lojas do usuário. Código: " + response.status);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar lojas do usuário:", error);
      throw error;
    }
  },

  create: async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar loja");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao criar loja:", error);
      throw error;
    }
  },

  update: async (id, formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar loja");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar loja:", error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar loja");
      }

      return true;
    } catch (error) {
      console.error("Erro ao deletar loja:", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar loja por ID. Código: " + response.status);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar loja por ID:", error);
      throw error;
    }
  },
};
