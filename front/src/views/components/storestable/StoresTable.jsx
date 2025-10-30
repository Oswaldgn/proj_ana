import { useEffect, useState, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { StoreAdminService } from "../../../models/api/StoreAdminService";
import styles from "./StoresTable.module.css"; 

/**
 * Tabela de Lojas para o Admin, com funcionalidades de busca, edição e exclusão.
 * @returns {JSX.Element} Componente StoresTable
 */
const StoresTable = ({ auth, setSnackbar, setLoading }) => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [editingStore, setEditingStore] = useState(null);

  const fetchStores = useCallback(async () => {
    if (!auth?.token) return;
    setLoading(true);
    try {
      const data = await StoreAdminService.getAllStores(auth.token);
      setStores(data);
    } catch (err) {
      setSnackbar({ open: true, message: "Erro ao carregar lojas: " + err.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [auth?.token, setLoading, setSnackbar]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const filteredStores = stores.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (storeId) => {
    if (!window.confirm("Tem certeza que deseja deletar esta loja?")) return;
    try {
      await StoreAdminService.remove(storeId, auth.token);
      setSnackbar({ open: true, message: "Loja deletada!", severity: "success" });
      fetchStores();
    } catch (err) {
      setSnackbar({ open: true, message: "Erro ao deletar loja: " + err.message, severity: "error" });
    }
  };

  const handleSaveEdit = async () => {
    try {
      await StoreAdminService.update(editingStore.id, editingStore, auth.token);
      setSnackbar({ open: true, message: "Loja atualizada!", severity: "success" });
      setEditingStore(null);
      fetchStores();
    } catch (err) {
      setSnackbar({ open: true, message: "Erro ao atualizar loja: " + err.message, severity: "error" });
    }
  };

  return (
    <>
      <TextField
        label="Buscar loja"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
        className={styles.searchField}
        InputLabelProps={{
            className: styles.searchField,
        }}
        InputProps={{
            className: styles.searchField,
        }}
      />

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell className={styles.tableHeadCell}>Nome</TableCell>
              <TableCell className={styles.tableHeadCell}>Endereço</TableCell>
              <TableCell className={styles.tableHeadCell}>Contato</TableCell>
              <TableCell className={styles.tableHeadCell}>Descrição</TableCell>
              <TableCell className={styles.tableHeadCell}>Imagem</TableCell>
              <TableCell className={styles.tableHeadCell}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStores.map((store) => (
              <TableRow key={store.id} className={styles.tableRow}>
                <TableCell className={styles.tableCell}>{store.name}</TableCell>
                <TableCell className={styles.tableCell}>{store.address}</TableCell>
                <TableCell className={styles.tableCell}>{store.contact}</TableCell>
                <TableCell className={styles.tableCell}>{store.description}</TableCell>
                <TableCell className={styles.tableCell}>{store.imageUrl ? store.imageUrl.substring(0, 15) + '...' : ""}</TableCell>
                <TableCell className={styles.tableCell}>
                  <IconButton onClick={() => setEditingStore(store)} className={styles.editButton}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(store.id)} className={styles.deleteButton}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={!!editingStore} onClose={() => setEditingStore(null)}>
        <DialogTitle className={styles.dialogTitle}>Editar Loja</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <TextField
            margin="dense"
            label="Nome"
            fullWidth
            variant="outlined"
            value={editingStore?.name || ""}
            onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Endereço"
            fullWidth
            variant="outlined"
            value={editingStore?.address || ""}
            onChange={(e) => setEditingStore({ ...editingStore, address: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contato"
            fullWidth
            variant="outlined"
            value={editingStore?.contact || ""}
            onChange={(e) => setEditingStore({ ...editingStore, contact: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            variant="outlined"
            value={editingStore?.description || ""}
            onChange={(e) => setEditingStore({ ...editingStore, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Imagem (URL)"
            fullWidth
            variant="outlined"
            value={editingStore?.imageUrl || ""}
            onChange={(e) => setEditingStore({ ...editingStore, imageUrl: e.target.value })}
          />
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={() => setEditingStore(null)} className={styles.cancelButton}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained" className={styles.saveButton}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { StoresTable };