const BASE_URL = "http://localhost:8080/api/tags";

export const TagService = {

  async getAllTags() {
    const response = await fetch(`${BASE_URL}/all`);
    if (!response.ok) throw new Error("Erro ao buscar todas as tags");
    return await response.json();
  },

  getTags: async (productId) => {
    const response = await fetch(`${BASE_URL}/product/${productId}`);
    if (!response.ok) throw new Error("Erro ao buscar tags");
    return await response.json();
  },

  createTag: async (productId, tagName) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/product/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tagName }),
    });
    if (!response.ok) throw new Error("Erro ao criar tag");
    return await response.json();
  },

  deleteTag: async (tagId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/${tagId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Erro ao deletar tag");
  },
};
