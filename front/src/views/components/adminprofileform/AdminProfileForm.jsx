import { useEffect, useState } from "react";
import { Box, TextField, Button, Alert, Stack } from "@mui/material";
import { updateUser } from "../../../models/api/adminService";
import styles from "./AdminProfileForm.module.css"; 

/**
 * AdminProfileForm componente para editar o perfil do administrador.
 * @constants {Object} props - Propriedades do componente.
 * @returns  {JSX.Element} 
 */
const AdminProfileForm = ({ user, token, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    phone: "",
    cpf: "",
    email: "",
    password: "",       
    confirmPassword: "", 
    role: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        cpf: user.cpf || "",
        email: user.email || "",
        password: "",        
        confirmPassword: "", 
        role: user.role || "USER",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      setMessage("As senhas não coincidem!");
      return;
    }

    const updateData = {
      name: form.name,
      lastName: form.lastName,
      phone: form.phone,
      cpf: form.cpf,
      role: form.role,
    };

    if (form.password) updateData.password = form.password;

    try {
      await updateUser(token, user.id, updateData);
      setMessage("Usuário atualizado com sucesso!");
      if (onSave) onSave();
      if (onClose) onClose();
    } catch (err) {
      setMessage("Erro ao atualizar usuário: " + err.message);
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      className={styles.formContainer} 
      sx={{ mt: 2 }} 
    >
      {message && <Alert severity="info">{message}</Alert>}
      <Stack spacing={2}>
        <TextField label="Nome" name="name" value={form.name} onChange={handleChange} fullWidth />
        <TextField label="Sobrenome" name="lastName" value={form.lastName} onChange={handleChange} fullWidth />
        <TextField label="Telefone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
        <TextField label="CPF" name="cpf" value={form.cpf} onChange={handleChange} fullWidth />
        <TextField label="Email" name="email" value={form.email} disabled fullWidth />
        <TextField label="Nova senha" type="password" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" fullWidth />
        <TextField label="Confirmar senha" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} fullWidth />
        <TextField label="Role" name="role" value={form.role} onChange={handleChange} fullWidth />
        <Button type="submit" variant="contained">Salvar alterações</Button>
      </Stack>
    </Box>
  );
}
export { AdminProfileForm };