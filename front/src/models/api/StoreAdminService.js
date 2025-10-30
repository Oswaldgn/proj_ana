const API_URL = "http://localhost:8080/api/store";

/**
 * Serviço para interagir com a API de administração de lojas.
 * Fornece métodos para buscar, atualizar e deletar lojas.
 * Cada método lida com requisições HTTP e tratamento de erros.
 * @module StoreAdminService
 * @constant getAllStores - Busca todas as lojas (requer token).
 * @constant getAllStoresPublic - Busca todas as lojas publicamente (sem token).
 * @constant remove - Deleta uma loja pelo ID (requer token).
 * @constant update - Atualiza uma loja pelo ID (requer token).
 * @returns {Object} Objeto com métodos para interagir com a API de lojas.
 */
const StoreAdminService = {
  getAllStores: async (token) => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao buscar lojas");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
      throw error;
    }
  },

  // Requisição pública (sem token)
  getAllStoresPublic: async () => {
    try {
      const response = await fetch(`${API_URL}/public`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao buscar lojas públicas");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar lojas públicas:", error);
      throw error;
    }
  },

  remove: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao deletar loja");
      }

      return true;
    } catch (error) {
      console.error("Erro ao deletar loja:", error);
      throw error;
    }
  },

  update: async (id, formData, token) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao atualizar loja");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar loja:", error);
      throw error;
    }
  },
};

export { StoreAdminService };
