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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";

import { StoreService, StoreAdminService } from "../../../models/api";
import { AuthContext } from "../../../models";
import { ProductCardList } from "../../../views/components";
import styles from "./StorePage.module.css";

const StorePage = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    contact: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const data = auth?.token
          ? await StoreService.getById(id)
          : await StoreAdminService.getByIdPublic(id);

        setStore(data);
        setProducts(data.products || []);

        setFormData({
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          contact: data.contact || "",
          imageUrl: data.imageUrl || "",
        });
      } catch (error) {
        setStore(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id, auth]);

  const canEdit =
    auth &&
    store &&
    (auth.role === "ADMIN" || auth.email === store.ownerEmail);

  const handleSave = async () => {
    try {
      await StoreService.update(id, formData, auth?.token);
      setStore({ ...store, ...formData });
      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao editar loja:", err);
    }
  };

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
      
      {/* Banner */}
      <Card className={styles.imageCard} sx={{ mb: 4 }}>
        <CardMedia
          component="img"
          height="350"
          image={store.imageUrl || "/default-store.jpg"}
          alt={store.name}
          className={styles.bannerImage}
        />
      </Card>

      {/* Conteúdo */}
      <Card className={styles.contentCard}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" fontWeight="bold" className={styles.mainTitle}>
              {store.name}
            </Typography>

            {canEdit && (
              <Button
                variant="contained"
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                Editar Loja
              </Button>
            )}
          </Stack>

          <Typography className={styles.bodyText} sx={{ mt: 2 }}>
            {store.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography className={styles.sectionTitle}>Endereço</Typography>
          <Typography className={styles.bodyText}>{store.address}</Typography>

          <Typography className={styles.sectionTitle} sx={{ mt: 2 }}>
            Contato
          </Typography>
          <Typography className={styles.bodyText}>{store.contact}</Typography>
        </CardContent>

        {/* Lista de Produtos */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Produtos
          </Typography>
          <ProductCardList products={products} canEdit={canEdit} storeId={id} />
        </Box>
      </Card>

      {/* Modal de Edição da Loja */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Loja</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Descrição"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            label="Endereço"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <TextField
            label="Contato"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          />
          <TextField
            label="Imagem (URL)"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export { StorePage };
