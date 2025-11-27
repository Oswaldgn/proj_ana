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
import { CommentService } from "../../../models/api/CommentService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export const ProductCommentModal = ({ open, onClose, productId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await CommentService.getComments(productId);
        setComments(data);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar comentários");
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchComments();
  }, [open, productId]);

  const handleCreate = async () => {
    if (!newComment) return;
    setCreating(true);
    try {
      const created = await CommentService.createComment(productId, { comment: newComment });
      setComments((prev) => [...prev, created]);
      setNewComment("");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar comentário");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Comentários
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Stack spacing={2} mb={2}>
            {comments.length === 0 && <Typography>Nenhum comentário.</Typography>}
            {comments.map((c) => (
              <Box key={c.id} sx={{ borderBottom: "1px solid #ccc", pb: 1 }}>
                <Typography variant="subtitle2">
                  {c.userName} - {c.createdAt}
                </Typography>
                <Typography>{c.comment}</Typography>
              </Box>
            ))}
          </Stack>
        )}

        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Escreva um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? "Enviando..." : "Enviar"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
