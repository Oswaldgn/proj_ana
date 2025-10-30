import { useState } from "react";
import {useAuth} from "../../../controllers";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import styles from "./Register.module.css";

const INITIAL_FORM_STATE = {
  email: "",
  password: "",
  name: "",
  lastName: "",
  cpf: "",
  phone: "",
  role: "USER",
};

const Register = () => {
  const { register } = useAuth();

  const [form, setForm] = useState(INITIAL_FORM_STATE);

  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  
  const handlePasswordConfirmChange = (e) => setPasswordConfirm(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== passwordConfirm) {
      setError("As senhas não coincidem!");
      return; 
    }

    setLoading(true);
    try {
      const created = await register(form);
      setSuccess("Usuário registrado: " + created.email);
      setForm(INITIAL_FORM_STATE); 
      setPasswordConfirm("");     
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Erro no registro");
    }
  };

  return (
    <Box maxWidth={640} mx="auto" className={styles.registerContainer}>
      <Typography variant="h5" gutterBottom className={styles.title}>Registrar</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 } } className={styles.alertBoxError}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} className={styles.alertBoxSuccess}>{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Nome" 
          className={styles.textField} 
          value={form.name} 
          onChange={handleChange("name")} 
          fullWidth margin="normal" 
          required 
        />
        <TextField 
          label="Sobrenome" 
          className={styles.textField} 
          value={form.lastName} 
          onChange={handleChange("lastName")} 
          fullWidth margin="normal" 
          required 
        />
        <TextField 
          label="Email" 
          className={styles.textField} 
          value={form.email} 
          onChange={handleChange("email")} 
          type="email" 
          fullWidth 
          margin="normal" 
          required
        />
        <TextField 
          label="Senha" 
          className={styles.textField} 
          value={form.password} 
          onChange={handleChange("password")} 
          type="password" 
          fullWidth 
          margin="normal" 
          required 
        />
        <TextField 
          label="Confirme a Senha" 
          className={styles.textField} 
          value={passwordConfirm} 
          onChange={handlePasswordConfirmChange} 
          type="password" 
          fullWidth 
          margin="normal" 
          required 
          error={!!error && error === "As senhas não coincidem!"}
          helperText={!!error && error === "As senhas não coincidem!" ? "As senhas não coincidem!" : ""}
        />
        <TextField 
          label="CPF" 
          className={styles.textField} 
          value={form.cpf} 
          onChange={handleChange("cpf")} 
          fullWidth 
          margin="normal" 
          required 
        />
        <TextField 
          label="Telefone" 
          className={styles.textField} 
          value={form.phone} 
          onChange={handleChange("phone")} 
          fullWidth 
          margin="normal" 
        />
        <Button type="submit" className={styles.submitButton} variant="contained" disabled={loading} sx={{ mt: 2 }}>
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Box>
  );
}
export { Register };