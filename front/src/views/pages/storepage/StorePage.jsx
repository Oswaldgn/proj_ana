import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Divider,
  Box,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { StoreService, AuthContext, StoreAdminService } from "../../../models";
import styles from "./StorePage.module.css";

const StorePage = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext); 
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        let data;

        if (auth && auth.token) {
          data = await StoreService.getById(id); 
        } else {
          data = await StoreAdminService.getByIdPublic(id); 
        }

        setStore(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          phone: data.contact || "", 
          imageUrl: data.imageUrl || "",
          ownerId: data.ownerId || null, 
        });
      } catch (error) {
        console.error("Erro ao carregar loja:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id, auth]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditToggle = () => setEditMode(!editMode);
  const handleCancel = () => {
    setFormData({
      name: store.name,
      description: store.description,
      address: store.address,
      phone: store.contact, 
      imageUrl: store.imageUrl,
      ownerId: store.ownerId || null,
    });
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      const updated = await StoreService.update(id, formData);
      setStore(updated);
      setEditMode(false);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  };

  const canEdit =
    auth &&
    store &&
    (auth.role === "ADMIN" || auth.email === store.ownerEmail);


  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!store) {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5">Loja não encontrada</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className={styles.pageContainer}>
      <Card sx={{ mb: 4 }} className={styles.imageCard}>
        <CardMedia
          component="img"
          height="400"
          image={store.imageUrl || "/default-store.jpg"}
          alt={store.name}
          sx={{ objectFit: "cover", objectPosition: "center" }}
        />
      </Card>
      <Card className={styles.contentCard}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="h4" fontWeight="bold" className={styles.mainTitle}>
              {editMode ? "Editar Loja" : store.name}
            </Typography>
            {canEdit && (
              <>
                {!editMode ? (
                  <Button variant="contained" onClick={handleEditToggle} className={styles.editButton}>
                    Editar
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      className={styles.saveButton}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      className={styles.cancelButton}
                    >
                      Cancelar
                    </Button>
                  </Stack>
                )}
              </>
            )}
          </Stack>
          {editMode ? (
            <>
              <TextField
                label="Nome da loja"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
                className={styles.textField}
              />
              <TextField
                label="Descrição"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
                className={styles.textField}
              />
              <TextField
                label="Endereço"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
                className={styles.textField}
              />
              <TextField
                label="Telefone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
                className={styles.textField}
              />
            </>
          ) : (
            <>
              <Typography variant="body1" color="text.secondary" gutterBottom className={styles.bodyText}>
                {store.description || "Sem descrição disponível."}
              </Typography>
              <Divider className={styles.divider} />
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" className={styles.sectionTitle}>Endereço</Typography>
                <Typography variant="body2" className={styles.bodyText}>
                  {store.address || "Endereço não informado"}
                </Typography>

                <Typography variant="h6" sx={{ mt: 2 }} className={styles.sectionTitle}>
                  Contato
                </Typography>
                <Typography variant="body2" className={styles.bodyText}>
                  {store.contact || "Telefone não informado"}
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export { StorePage };