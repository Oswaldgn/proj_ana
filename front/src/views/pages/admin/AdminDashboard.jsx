import { useContext, useState } from "react";
import { Box, Typography, Snackbar, Alert, Backdrop, CircularProgress, Tabs, Tab } from "@mui/material";
import { AuthContext } from "../../../models/stores/AuthContext";

import { UsersTable } from "../../../views/components/usertable/UsersTable";
import { StoresTable } from "../../../views/components/storestable/StoresTable";

import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ padding: 4 }} className={styles.dashboardContainer}>
      <Typography variant="h4" gutterBottom>Painel de Administração</Typography>

      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ marginBottom: 2 }}>
        <Tab label="Usuários" />
        <Tab label="Lojas" />
      </Tabs>

      {tab === 0 && (
        <UsersTable
          auth={auth}
          setSnackbar={setSnackbar}
          setLoading={setLoading}
        />
      )}

      {tab === 1 && (
        <StoresTable
          auth={auth}
          setSnackbar={setSnackbar}
          setLoading={setLoading}
        />
      )}

      {/* Snackbar global */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loader global */}
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export { AdminDashboard };
