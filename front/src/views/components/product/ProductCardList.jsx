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
import CommentIcon from "@mui/icons-material/Comment";
import Rating from "@mui/material/Rating";

import { ProductService } from "../../../models/api/ProductService";
import { CreateProductModal } from "../../components/productmodal/CreateProductModal";
import { EditProductModal } from "../../components/productmodal/EditProductModal";
import { ProductCommentModal } from "../../components/productcommentmodal/ProductCommentModal";

const ProductCardList = ({ storeId, canEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await ProductService.getByStoreId(storeId);
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [storeId]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await ProductService.remove(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
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

  const handleRate = async (productId, value) => {
    if (!value) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para avaliar!");
      return;
    }
    try {
      const response = await ProductService.rate(productId, value, token);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, rating: Number(response.averageRating) || Number(response.rating) }
            : p
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenComments = (productId) => {
    setSelectedProductId(productId);
    setOpenCommentModal(true);
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateModal(true)}
          >
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
                  <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <Rating
                      name={`rating-${product.id}`}
                      value={Number(product.rating) || 0}
                      precision={0.5}
                      onChange={(event, newValue) =>
                        handleRate(product.id, newValue)
                      }
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {product.rating ? Number(product.rating).toFixed(1) : "0.0"}
                    </Typography>
                  </Box>

                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {product.name}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenComments(product.id)}
                      >
                        <CommentIcon />
                      </IconButton>
                      {canEdit && (
                        <>
                          <IconButton size="small" onClick={() => handleEdit(product)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(product.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </Stack>
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
      <ProductCommentModal
        open={openCommentModal}
        onClose={() => setOpenCommentModal(false)}
        productId={selectedProductId}
      />
    </Box>
  );
};

export { ProductCardList };
