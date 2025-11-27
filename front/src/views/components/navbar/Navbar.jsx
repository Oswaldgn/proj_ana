import { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../models";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Produtos", path: "/products" },
  ];

  if (auth) {
    menuItems.push({
      label: "Dashboard",
      path: auth.role === "ADMIN" ? "/admin" : "/dashboard",
    });
    menuItems.push({ label: "Logout", action: handleLogout });
  } else {
    menuItems.push({ label: "Login", path: "/login" });
    menuItems.push({ label: "Register", path: "/register" });
  }

  return (
    <>
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

          {/* Desktop Menu */}
          <div className={styles.desktopMenu}>
            {menuItems.map((item, idx) =>
              item.action ? (
                <Button key={idx} color="inherit" onClick={item.action}>
                  {item.label}
                </Button>
              ) : (
                <Button
                  key={idx}
                  color="inherit"
                  component={Link}
                  to={item.path}
                >
                  {item.label}
                </Button>
              )
            )}
          </div>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            edge="end"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <List sx={{ width: 250 }}>
          {menuItems.map((item, idx) => (
            <ListItem key={idx} disablePadding>
              {item.action ? (
                <ListItemButton onClick={() => { item.action(); setDrawerOpen(false); }}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ) : (
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export { Navbar };
