import { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../models";
import styles from "./Navbar.module.css"; 

/**
 *  Navbar componente de barra de navegação.
 * @returns  {JSX.Element} componente de barra de navegação.
 */
const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          className={styles.logo}
        >
          Loja
        </Typography>

        {!auth && (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}

        {auth && (
          <>
            <Typography sx={{ mr: 2 }}>{auth.email}</Typography>
            <Button
              color="inherit"
              onClick={() => nav(auth.role === "ADMIN" ? "/admin" : "/dashboard")}
            >
              Dashboard
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
export { Navbar };