import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { StoreService } from "../../../models/api/StoreService";
import styles from "./StoreForm.module.css"; 

/**
 *  Componente para gerenciar o formulário de lojas.
 *  Renderiza uma lista de lojas com funcionalidades para adicionar, editar, deletar e buscar lojas.
 * @returns  {JSX.Element} Componente StoreForm
 */
const StoreForm = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    const filtered = stores.filter((store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [searchTerm, stores]);

  const loadStores = async () => {
    try {
      const data = await StoreService.getMyStores();
      setStores(data);
      setFilteredStores(data);
    } catch (error) {
      console.error("Erro ao carregar lojas:", error);
      alert(error.message || "Erro desconhecido ao carregar lojas");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await StoreService.update(editing.id, formData);
      } else {
        await StoreService.create(formData);
      }
      setOpen(false);
      setFormData({
        name: "",
        address: "",
        contact: "",
        imageUrl: "",
        description: "",
      });
      setEditing(null);
      await loadStores();
    } catch (error) {
      console.error("Erro ao salvar loja:", error);
      alert(error.message || "Erro desconhecido ao salvar loja");
    }
  };

  const handleEdit = (store) => {
    setFormData(store);
    setEditing(store);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta loja?")) {
      try {
        await StoreService.remove(id);
        await loadStores();
      } catch (error) {
        console.error("Erro ao excluir loja:", error);
        alert(error.message || "Erro desconhecido ao excluir loja");
      }
    }
  };

  return (
    <div className={styles.container}> 
      <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>
        Gerenciar Lojas
      </Typography>
      <Button
        variant="contained"
        className={styles.primaryButton} 
        onClick={() => {
          setEditing(null);
          setFormData({
            name: "",
            address: "",
            contact: "",
            imageUrl: "",
            description: "",
          });
          setOpen(true);
        }}
        sx={{ mb: 2 }}
      >
        Nova Loja
      </Button>
      <TextField
        label="Buscar loja"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
        className={styles.searchField} 
        InputLabelProps={{
          className: styles.searchField, 
        }}
        InputProps={{
          className: styles.searchField, 
        }}
        variant="outlined" 
      />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {filteredStores.map((store) => (
          <Grid item xs={12} sm={6} md={4} key={store.id}>
            <Card className={styles.storeCard}> 
              <CardContent>
                <Typography variant="h6" className={styles.storeCardTitle}>
                  {store.name}
                </Typography>
                <Typography variant="body2" className={styles.storeCardContent}>
                  {store.address}
                </Typography>
                <Typography variant="body2" className={styles.storeCardContent}>
                  {store.contact}
                </Typography>
                {store.imageUrl && (
                  <img
                    src={store.imageUrl}
                    alt={store.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginTop: "8px",
                    }}
                  />
                )}
                <Typography variant="body2" className={styles.storeCardContent} sx={{ mt: 1 }}>
                  {store.description}
                </Typography>

                {/* 6. Aplica classes para estilizar os IconButtons */}
                <IconButton onClick={() => handleEdit(store)} className={styles.editButton}> 
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(store.id)} className={styles.deleteButton}>
                  <Delete />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        {/* 7. Aplica classes para estilizar o Dialog */}
        <DialogTitle className={styles.dialogTitle}> 
          {editing ? "Editar Loja" : "Nova Loja"}
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <TextField
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
            variant="outlined"
          />
          <TextField
            label="Endereço"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="dense"
            variant="outlined"
          />
          <TextField
            label="Contato"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            fullWidth
            margin="dense"
            variant="outlined"
          />
          <TextField
            label="Imagem (URL)"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            fullWidth
            margin="dense"
            variant="outlined"
          />
          <TextField
            label="Descrição"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
            multiline
            rows={3}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#a0a0a0" }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" className={styles.primaryButton}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { StoreForm };