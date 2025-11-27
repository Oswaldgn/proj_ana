import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material"; 

import { ProductService } from "../../../models/api/ProductService";

const EditProductModal = ({ open, onClose, product, onProductUpdated }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    discount: "", // adicionado
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        imageUrl: product.imageUrl || "",
        discount: product.discount || "", // adicionado
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const numericPrice = parseFloat(form.price);
    const numericDiscount = parseFloat(form.discount) || 0;

    if (isNaN(numericPrice)) {
      alert("ERRO: Preço inválido!");
      return;
    }
    if (numericDiscount < 0 || numericDiscount > 100) {
      alert("ERRO: Desconto inválido! Deve estar entre 0 e 100%");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const updatedProduct = {
        name: form.name,
        description: form.description,
        price: numericPrice,
        imageUrl: form.imageUrl,
        discount: numericDiscount, // enviado
      };

      const saved = await ProductService.update(product.id, updatedProduct, token);

      if (onProductUpdated) onProductUpdated(saved);

      onClose();
    } catch (err) {
      console.error("Erro ao editar produto:", err);
      alert("Erro ao editar produto");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Editar Produto</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nome"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Descrição"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
          />
          <TextField
            label="Preço"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Desconto (%)"
            name="discount"
            type="number"
            value={form.discount}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="URL da Imagem"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          Salvar Alterações
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { EditProductModal };
