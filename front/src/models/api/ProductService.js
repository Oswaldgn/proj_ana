const URL_BASE = "http://localhost:8080/api/products";

export const ProductService = {
  async getAllProducts() {
    const response = await fetch(URL_BASE);
    if (!response.ok) throw new Error("Erro ao carregar produtos");

    const data = await response.json();
    return data.map((p) => ({ ...p, rating: p.averageRating || 0 }));
  },

  async getByStoreId(storeId) {
    if (!storeId || isNaN(storeId)) throw new Error("storeId deve ser um número");

    const response = await fetch(`${URL_BASE}/store/${storeId}`);
    if (!response.ok) throw new Error("Erro ao carregar produtos");

    const data = await response.json();
    return data.map((p) => ({ ...p, rating: p.averageRating || 0 }));
  },

  async create(storeId, productData, token) {
    const response = await fetch(`${URL_BASE}/store/${storeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Erro ao criar produto");
    return await response.json();
  },

  async update(id, productData, token) {
    const response = await fetch(`${URL_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Erro ao editar produto");
    return await response.json();
  },

  async remove(id, token) {
    const response = await fetch(`${URL_BASE}/${id}`, {
      method: "DELETE",
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    if (!response.ok) throw new Error("Erro ao excluir produto");
    return true;
  },

  async rate(productId, rating, token) {
    const response = await fetch(`${URL_BASE}/${productId}/rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ rating }),
    });
    if (!response.ok) throw new Error("Erro ao enviar rating");
    return await response.json();
  },
};
