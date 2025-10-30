const API_URL = "http://localhost:8080/api/users";

/**
 * Obtém o usuário atual.
 * @param {string} token - Token de autenticação.
 * @returns {Promise<Object>} Dados do usuário atual.
 */
const getCurrentUser = async (token) => {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Falha ao obter usuário");
  }
  return response.json();
};

/**
 * Atualiza os dados do usuário atual.
 * @param {string} token - Token de autenticação.
 * @param {Object} userData - Dados do usuário a serem atualizados.
 * @returns {Promise<Object>} Dados do usuário atualizado.
 */
const updateCurrentUser = async (token, userData) => {
  const response = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error("Falha ao atualizar usuário");
  }
  return response.json();
};
export { getCurrentUser, updateCurrentUser };