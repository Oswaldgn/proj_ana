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

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const data = auth?.token
          ? await StoreService.getById(id)
          : await StoreAdminService.getByIdPublic(id);

        setStore(data);
        setProducts(data.products || []);
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
      <Card className={styles.imageCard} sx={{ mb: 4 }}>
        <CardMedia
          component="img"
          height="350"
          image={store.imageUrl || "/default-store.jpg"}
          alt={store.name}
          className={styles.bannerImage}
        />
      </Card>

      <Card className={styles.contentCard}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" fontWeight="bold" className={styles.mainTitle}>
              {store.name}
            </Typography>

            {canEdit && (
              <Button variant="contained" className={styles.editButton}>
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
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Produtos
          </Typography>
          <ProductCardList products={products} canEdit={canEdit} storeId={id} />
        </Box>
      </Card>
    </Container>
  );
};

export { StorePage };
