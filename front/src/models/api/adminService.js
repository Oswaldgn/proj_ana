const API_URL = "http://localhost:8080/api/users";

/**
 * Busca todos os usuários cadastrados.
 * @param {string} token - Token de autenticação.
 * @returns {Promise<Array>} Lista de usuários.
 */
async function getAllUsers(token) {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar usuários: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Busca um usuário pelo ID.
 * @param {string} token - Token de autenticação.
 * @param {string} id - ID do usuário.
 * @returns {Promise<Object>} Dados do usuário.
 */
async function getUserById(token, id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Atualiza um usuário existente.
 * @param {string} token - Token de autenticação.
 * @param {string} id - ID do usuário.
 * @param {Object} userData - Dados do usuário a serem atualizados.
 * @returns {Promise<Object>} Dados do usuário atualizado.
 */
async function updateUser(token, id, userData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro ao atualizar usuário: ${text}`);
  }

  return await response.json();
}

/**
 * Deleta um usuário pelo ID.
 * @param {string} token - Token de autenticação.
 * @param {string} id - ID do usuário.
 * @returns {Promise<boolean>} Resultado da operação.
 */
async function deleteUser(token, id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro ao deletar usuário: ${text}`);
  }

  return true;
}

export {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};