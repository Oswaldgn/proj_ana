import { AuthInterface } from "./AuthInterface";

/**
 * Cria instâncias de AuthInterface a partir das respostas da API.
 * @class ApiFactory - Cria objetos de autenticação a partir das respostas da API.
 * @static createAuthFromRegisterResponse - Cria AuthInterface a partir da resposta de registro.
 * @static createAuthFromLoginResponse - Cria AuthInterface a partir da resposta de login.
 * @static createAuthFromMeResponse - Cria AuthInterface a partir da resposta de obtenção dos dados do usuário.
 * @returns {AuthInterface} Instância de AuthInterface.
 */
class ApiFactory {
  static createAuthFromRegisterResponse(userResponse) {
    return new AuthInterface({
      email: userResponse.email,
      role: userResponse.role,
      token: null
    });
  }

  static createAuthFromLoginResponse(tokenResponse) {
    let tokenValue = null;
    if (!tokenResponse) tokenValue = null;
    else if (typeof tokenResponse === "string") tokenValue = tokenResponse;
    else if (tokenResponse.token) tokenValue = tokenResponse.token;
    return new AuthInterface({ email: null, role: null, token: tokenValue });
  }

  static createAuthFromMeResponse(meResponse) {
    return new AuthInterface({
      email: meResponse.email,
      role: meResponse.role,
      token: meResponse.token ?? null
    });
  }
}

export { ApiFactory };
