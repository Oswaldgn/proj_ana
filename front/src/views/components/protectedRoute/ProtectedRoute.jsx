import { useContext } from "react";
import { Navigate } from "react-router-dom";
import  {AuthContext}  from "../../../models/stores/AuthContext";

/**
 * ProtectedRoute exige que o usuário esteja autenticado.
 * Se role for passado, exige que user.role === role.
 */
const ProtectedRoute = ({ children, role }) => {
  const { auth } = useContext(AuthContext);

  if (!auth || !auth.token) {
    return <Navigate to="/login" replace />;
  }
  if (role && auth.role !== role) {
    return <div>403 - Acesso negado</div>;
  }
  return children;
}
export { ProtectedRoute };