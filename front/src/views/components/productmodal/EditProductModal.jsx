// src/views/components/productmodal/EditProductModal.jsx
import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { ProductService } from "../../../models/api/ProductService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 520,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
};

export function EditProductModal({ open, onClose, product, onProductUpdated }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    imageUrl: "",
    discount: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? "",
        price: product.price ?? "",
        quantity: product.quantity ?? "",
        description: product.description ?? "",
        imageUrl: product.imageUrl ?? "",
        discount: product.discount ?? "",
      });
    }
  }, [product]);

  const handleChange = (field) => (e) => {
    setForm((s) => ({ ...s, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar autenticado para editar produtos.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        quantity: Number(form.quantity),
        description: form.description,
        imageUrl: form.imageUrl,
        discount: form.discount === "" ? null : Number(form.discount),
      };

      const updated = await ProductService.update(product.id, payload, token);

      // chama callback do pai com produto atualizado
      if (onProductUpdated) onProductUpdated(updated);

      onClose();
    } catch (err) {
      console.error("Erro ao editar produto:", err);
      alert("Erro ao editar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={!!open} onClose={onClose}>
      <Box component="form" sx={style} onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Editar Produto
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Nome"
            value={form.name}
            onChange={handleChange("name")}
            fullWidth
            required
          />

          <TextField
            label="Preço"
            value={form.price}
            onChange={handleChange("price")}
            fullWidth
            required
            type="number"
            inputProps={{ step: "0.01" }}
          />

          <TextField
            label="Quantidade"
            value={form.quantity}
            onChange={handleChange("quantity")}
            fullWidth
            required
            type="number"
            inputProps={{ step: "1" }}
          />

          <TextField
            label="Desconto (%)"
            value={form.discount ?? ""}
            onChange={handleChange("discount")}
            fullWidth
            type="number"
            inputProps={{ step: "0.01" }}
          />

          <TextField
            label="URL da Imagem"
            value={form.imageUrl}
            onChange={handleChange("imageUrl")}
            fullWidth
          />

          <TextField
            label="Descrição"
            value={form.description}
            onChange={handleChange("description")}
            fullWidth
            multiline
            minRows={3}
          />

          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Salvar"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
