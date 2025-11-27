const API_URL = "http://localhost:8080/api/comments";

export const CommentService = {
  getComments: async (productId) => {
    try {
      const response = await fetch(`${API_URL}/product/${productId}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar comentários");
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
      throw error;
    }
  },

  createComment: async (productId, data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/product/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Erro ao criar comentário");
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao deletar comentário");
      }
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
      throw error;
    }
  },
};
