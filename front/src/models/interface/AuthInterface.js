/**
 * AuthInterface é uma classe que representa a interface de autenticação do usuário.
 * @interface AuthInterface
 * @property {string} email
 * @property {string} role
 * @property {string} token
 */
class AuthInterface {
  constructor({ email = null, role = null, token = null } = {}) {
    this.email = email;
    this.role = role;
    this.token = token;
  }
}

export { AuthInterface };
