import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../models/stores/AuthContext";
import { getCurrentUser, updateCurrentUser } from "../../../models";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Paper,
} from "@mui/material";

// 💡 IMPORTAÇÃO DO CSS MODULE
import styles from "./UserProfileForm.module.css";

const UserProfileForm = () => {
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    phone: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Carrega dados do usuário logado
  useEffect(() => {
    if (!auth?.token) return;

    setLoading(true);
    getCurrentUser(auth.token)
      .then((user) => setForm({ ...user, confirmPassword: "" }))
      .catch((err) =>
        setSnackbar({
          open: true,
          message: "Erro ao carregar perfil: " + err.message,
          severity: "error",
        })
      )
      .finally(() => setLoading(false));
  }, [auth]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validação da senha
    if (form.password && form.password !== form.confirmPassword) {
      setSnackbar({
        open: true,
        message: "Senha e confirmação não coincidem!",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await updateCurrentUser(auth.token, form);
      setSnackbar({
        open: true,
        message: "Perfil atualizado com sucesso!",
        severity: "success",
      });
      // Limpar o campo de confirmação
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Erro ao atualizar: " + err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      className={styles.paperContainer}
    >
      <Typography variant="h5" gutterBottom>
        Meu Perfil
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        className={styles.formBox}
      >
        <TextField
          label="Nome"
          name="name"
          value={form.name ?? ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Sobrenome"
          name="lastName"
          value={form.lastName ?? ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Telefone"
          name="phone"
          value={form.phone ?? ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="CPF"
          name="cpf"
          value={form.cpf ?? ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Email"
          name="email"
          value={form.email ?? ""}
          fullWidth
          disabled
          variant="outlined"
        />

        <TextField
          label="Nova senha"
          type="password"
          name="password"
          value={form.password ?? ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Confirmar senha"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword ?? ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          error={form.password !== form.confirmPassword && form.confirmPassword !== ""}
          helperText={
            form.password !== form.confirmPassword && form.confirmPassword !== ""
              ? "Senha e confirmação não coincidem"
              : ""
          }
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          className={styles.saveButton}
        >
          Salvar alterações
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
}
export { UserProfileForm };