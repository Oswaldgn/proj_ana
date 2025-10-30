import { useEffect, useState, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions,
  Typography 
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllUsers, deleteUser } from "../../../models";
import { AdminProfileForm } from "../../components/adminprofileform/AdminProfileForm";
import styles from "./UsersTable.module.css"; 

/**
 * Componente para exibir e gerenciar a tabela de usuários. 
 * @param {Object} props
 * @returns {JSX.Element} ,Tabela de usuários com funcionalidades de busca, edição e exclusão.
 */
const UsersTable = ({ auth, setSnackbar, setLoading }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, userId: null });

  const fetchUsers = useCallback(async () => {
    if (!auth?.token) return;
    setLoading(true);
    try {
      const data = await getAllUsers(auth.token);
      setUsers(data);
    } catch (err) {
      setSnackbar({ open: true, message: "Erro ao carregar usuários: " + err.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [auth?.token, setLoading, setSnackbar]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (userId) => {
    try {
      await deleteUser(auth.token, userId);
      setSnackbar({ open: true, message: "Usuário deletado!", severity: "success" });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: "Erro ao deletar usuário: " + err.message, severity: "error" });
    } finally {
      setConfirmDelete({ open: false, userId: null });
    }
  };

  return (
    <>
      <TextField
        label="Buscar usuário"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        className={styles.searchField}
        InputLabelProps={{ className: styles.searchField }}
        InputProps={{ className: styles.searchField }}
      />

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell className={styles.tableHeadCell}>Nome</TableCell>
              <TableCell className={styles.tableHeadCell}>Sobrenome</TableCell>
              <TableCell className={styles.tableHeadCell}>Email</TableCell>
              <TableCell className={styles.tableHeadCell}>Telefone</TableCell>
              <TableCell className={styles.tableHeadCell}>CPF</TableCell>
              <TableCell className={styles.tableHeadCell}>Role</TableCell>
              <TableCell className={styles.tableHeadCell}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className={styles.tableRow}>
                <TableCell className={styles.tableCell}>{user.name}</TableCell>
                <TableCell className={styles.tableCell}>{user.lastName}</TableCell>
                <TableCell className={styles.tableCell}>{user.email}</TableCell>
                <TableCell className={styles.tableCell}>{user.phone}</TableCell>
                <TableCell className={styles.tableCell}>{user.cpf}</TableCell>
                <TableCell className={styles.tableCell}>{user.role}</TableCell>
                <TableCell className={styles.tableCell}>
                  <IconButton onClick={() => setEditingUser(user)} className={styles.editButton}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setConfirmDelete({ open: true, userId: user.id })} className={styles.deleteButton}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={!!editingUser} onClose={() => setEditingUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle className={styles.dialogTitle}>Editar Usuário</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          {editingUser && (
            <AdminProfileForm
              user={editingUser}
              token={auth.token}
              onClose={() => setEditingUser(null)}
              onSave={fetchUsers}
            />
          )}
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={() => setEditingUser(null)} className={styles.cancelButton}>Fechar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, userId: null })}>
        <DialogTitle className={styles.dialogTitle}>Confirmar exclusão</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <Typography className={styles.dialogContent}>Tem certeza que deseja deletar este usuário?</Typography>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={() => setConfirmDelete({ open: false, userId: null })} className={styles.cancelButton}>Cancelar</Button>
          <Button 
            variant="contained" 
            className={styles.confirmDeleteButton} 
            onClick={() => handleDelete(confirmDelete.userId)}
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export { UsersTable };