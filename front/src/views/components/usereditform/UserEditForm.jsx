import { useState } from "react";
import { updateCurrentUser } from "../../../models";
import {
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import styles from "./UserEditForm.module.css"; 

/**
 *  Componente para editar os dados do usuário.
 * @returns  {JSX.Element} Componente UserEditForm
 */
const UserEditForm = ({ user, token, onCancel, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccessMsg("");

    try {
      const updatedUser = await updateCurrentUser(token, formData);
      onUpdate(updatedUser);
      setSuccessMsg("Dados atualizados com sucesso!");
    } catch (err) {
      setError(err.message || "Erro desconhecido ao atualizar dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <Stack spacing={2}>
        <Typography variant="h6" className={styles.title}>
          Editar Cadastro
        </Typography>

        <TextField
          label="Nome"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          className={styles.textField}
        />

        <TextField
          label="Sobrenome"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          className={styles.textField}
        />

        <TextField
          label="Telefone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          className={styles.textField}
        />

        {error && <Alert severity="error">{error}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}

        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
          <Button 
            type="submit" 
            variant="contained" 
            className={styles.saveButton} 
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
          <Button 
            variant="outlined" 
            onClick={onCancel}
            className={styles.cancelButton} 
          >
            Cancelar
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export { UserEditForm };