import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Container,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import { StoreAdminService } from "../../../models/api/StoreAdminService";
import styles from "./HomePage.module.css"; // Importa o módulo CSS

const ITEMS_PER_PAGE = 8;

const HomePage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await StoreAdminService.getAllStoresPublic();
        setStores(data);
      } catch (err) {
        console.error("Erro ao buscar lojas:", err);
        setError("Erro ao carregar lojas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStore = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstStore = indexOfLastStore - ITEMS_PER_PAGE;
  const visibleStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);

  const totalPages = Math.ceil(filteredStores.length / ITEMS_PER_PAGE);

  return (
    <Container className={styles.container}>
      {/* Aplica a classe ao Card de Apresentação */}
      <Card sx={{ mb: 4 }} className={styles.presentationCard}>
        <CardMedia
          component="img"
          height="300"
          image="/presentation.jpg"
          alt="Apresentação do site"
        />
      </Card>
      {/* Aplica a classe ao Campo de Busca */}
      <TextField
        fullWidth
        label="Buscar loja"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); 
        }}
        sx={{ mb: 4 }}
        className={styles.searchField}
      />

      {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
      {error && <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>{error}</Typography>}

      <Grid container spacing={4} justifyContent="center">
        {visibleStores.map((store) => (
          <Grid item xs={12} sm={6} md={5} key={store.id}>
            <Card
              // Aplica a classe ao Card da Loja e remove os estilos sx que serão gerenciados pelo CSS
              className={styles.storeCard}
              sx={{ 
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
              }}
            >
              <CardActionArea sx={{ display: "flex", flexDirection: "column" }}>
                {store.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={store.imageUrl}
                    alt={store.name}
                    sx={{ objectFit: "cover", width: "100%" }}
                  />
                )}
                <CardContent>
                  {/* Aplica a classe ao Título da Loja */}
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }} className={styles.storeTitle}>
                    {store.name}
                  </Typography>
                  {/* Aplica a classe ao Texto Secundário */}
                  <Typography variant="body2" color="text.secondary" mb={0.5} className={styles.storeSecondaryText}>
                    {store.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={0.5} className={styles.storeSecondaryText}>
                    {store.contact}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className={styles.storeSecondaryText}>
                    {store.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Paginação */}
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        <Button
          // Aplica a classe ao botão de Paginação
          className={styles.paginationButton}
          variant="contained"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Anterior
        </Button>
        {/* Aplica a classe ao texto da Paginação */}
        <Typography variant="body1" sx={{ mx: 2, display: "flex", alignItems: "center" }} className={styles.paginationText}>
          {currentPage} / {totalPages}
        </Typography>
        <Button
          // Aplica a classe ao botão de Paginação
          className={styles.paginationButton}
          variant="contained"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Próximo
        </Button>
      </Grid>
    </Container>
  );
};

export { HomePage };