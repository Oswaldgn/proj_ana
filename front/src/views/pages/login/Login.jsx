import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../../controllers";
import { AuthContext } from "../../../models/stores/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import styles from "./Login.module.css";

const Login = () => {
  const { login } = useAuth();
  const { error } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);
    try {
      const user = await login({ email, password });
      setLoading(false);
      if (user.role === "ADMIN") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setLocalError(err.message || "Erro no login");
    }
  };

  return (
    <Box maxWidth={480} mx="auto" className={styles.loginContainer}>
      <Typography variant="h5" gutterBottom className={styles.title}>Login</Typography>
      {localError && <Alert severity="error" sx={{ mb: 2 }} className={styles.alertBox}>{localError}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }} className={styles.alertBox}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField label="Email" className={styles.textField} value={email} onChange={(e)=>setEmail(e.target.value)} fullWidth margin="normal" required />
        <TextField label="Senha" className={styles.textField} type="password" value={password} onChange={(e)=>setPassword(e.target.value)} fullWidth margin="normal" required />
        <Button type="submit" className={styles.submitButton} variant="contained" disabled={loading} sx={{ mt: 2 }}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Box>
  );
}

export { Login };