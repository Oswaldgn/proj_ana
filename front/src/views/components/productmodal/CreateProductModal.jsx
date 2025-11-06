import { useState } from "react";
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

const CreateProductModal = ({ open, onClose, storeId, onProductCreated }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const numericStoreId = Number(storeId);
    const numericPrice = parseFloat(form.price);
    const token = localStorage.getItem("token");

    if (isNaN(numericStoreId)) {
      alert("ERRO: storeId deve ser numérico!");
      return;
    }

    if (isNaN(numericPrice)) {
      alert("ERRO: Preço inválido!");
      return;
    }

    try {
      const productData = {
        name: form.name,
        description: form.description,
        price: numericPrice,
        imageUrl: form.imageUrl,
      };

      const saved = await ProductService.create(numericStoreId, productData, token);

      if (onProductCreated) onProductCreated(saved);

      setForm({ name: "", description: "", price: "", imageUrl: "" });
      onClose();
    } catch (err) {
      console.error("Erro ao criar produto:", err);
      alert("Erro ao criar produto");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Criar Produto</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Nome" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField label="Descrição" name="description" value={form.description} onChange={handleChange} multiline rows={3} />
          <TextField label="Preço" name="price" type="number" value={form.price} onChange={handleChange} fullWidth />
          <TextField label="URL da Imagem" name="imageUrl" value={form.imageUrl} onChange={handleChange} fullWidth />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export { CreateProductModal };
