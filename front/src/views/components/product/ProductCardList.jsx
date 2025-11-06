import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { ProductService } from "../../../models/api/ProductService";
import { CreateProductModal } from "../../components/productmodal/CreateProductModal"; 
import { EditProductModal } from "../../components";


const ProductCardList = ({ storeId, canEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await ProductService.getByStoreId(storeId);
        setProducts(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [storeId]);

  const handleCreate = () => setOpenCreateModal(true);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await ProductService.remove(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto");
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {canEdit && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Novo Produto
          </Button>
        </Stack>
      )}

      {products.length === 0 ? (
        <Typography sx={{ textAlign: "center", mt: 4 }}>
          Nenhum produto cadastrado.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="160"
                  image={product.imageUrl || "/default-product.jpg"}
                  alt={product.name}
                />
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6" fontWeight="bold">
                      {product.name}
                    </Typography>

                    {canEdit && (
                      <>
                        <IconButton size="small" onClick={() => handleEdit(product)}>
                          <EditIcon />
                        </IconButton>
                        
                        <IconButton size="small" color="error" onClick={() => handleDelete(product.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Stack>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    R$ {Number(product.price).toFixed(2)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {product.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <CreateProductModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        storeId={storeId}
        onProductCreated={handleProductCreated}
      />
      <EditProductModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        product={selectedProduct}
        onProductUpdated={handleProductUpdated}
      />

    </Box>
  );
};

export { ProductCardList };