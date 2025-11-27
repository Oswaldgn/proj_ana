import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Stack,
  CircularProgress,
  Box,
} from "@mui/material";
import { TagService } from "../../../models/api/TagService";

export const ProductTagModal = ({ open, onClose, productId }) => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const data = await TagService.getTags(productId);
        setTags(data);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar tags");
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchTags();
  }, [open, productId]);

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    setSaving(true);
    try {
      const created = await TagService.createTag(productId, newTag.trim());
      setTags((prev) => [...prev, created]);
      setNewTag("");
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar tag");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (!window.confirm("Deseja remover esta tag?")) return;
    try {
      await TagService.deleteTag(tagId);
      setTags((prev) => prev.filter((t) => t.id !== tagId));
    } catch (err) {
      console.error(err);
      alert("Erro ao remover tag");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Gerenciar Tags</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={1} sx={{ mt: 2 }}>
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.tagName}
                onDelete={() => handleDeleteTag(tag.id)}
                color="primary"
              />
            ))}
          </Stack>
        )}
        <TextField
          fullWidth
          label="Nova tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          sx={{ mt: 2 }}
          disabled={saving}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
        <Button onClick={handleAddTag} variant="contained" disabled={saving}>
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
