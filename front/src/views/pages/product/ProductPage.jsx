import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Box,
  CircularProgress,
  Stack,
  Rating,
} from "@mui/material";

import { ProductService } from "../../../models/api/ProductService";
import { TagService } from "../../../models/api/TagService";

import styles from "./ProductPage.module.css";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productsData = await ProductService.getAllProducts();
        const tagsData = await TagService.getAllTags();

        const productsWithTags = productsData.map((product) => ({
          ...product,
          tags: tagsData.filter((t) => t.productId === product.id),
        }));

        setProducts(productsWithTags);
        setTags(tagsData);
        setFilteredProducts(productsWithTags);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let tempProducts = [...products];

    if (search) {
      tempProducts = tempProducts.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      tempProducts = tempProducts.filter((p) =>
        p.tags.some((t) => selectedTags.includes(t.tagName))
      );
    }

    if (sort === "date-newest") tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sort === "date-oldest") tempProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sort === "price-high") tempProducts.sort((a, b) => b.price - a.price);
    else if (sort === "price-low") tempProducts.sort((a, b) => a.price - b.price);

    setFilteredProducts(tempProducts);
  }, [search, selectedTags, sort, products]);

  const handleTagChange = (tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  if (loading) return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Stack direction="row" spacing={2}>
        <Box className={styles.filterBox}>
          <Typography variant="h6">Filtrar por Tags</Typography>
          {tags.map((tag) => (
            <FormControlLabel
              key={tag.id}
              control={
                <Checkbox
                  checked={selectedTags.includes(tag.tagName)}
                  onChange={() => handleTagChange(tag.tagName)}
                />
              }
              label={tag.tagName}
              className={styles.checkboxLabel}
            />
          ))}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="Pesquisar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              className={styles.textField}
            />
            <FormControl className={styles.select}>
              <InputLabel>Ordenar por</InputLabel>
              <Select value={sort} label="Ordenar por" onChange={(e) => setSort(e.target.value)}>
                <MenuItem value="">Padrão</MenuItem>
                <MenuItem value="price-high">Maior preço</MenuItem>
                <MenuItem value="price-low">Menor preço</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Grid container spacing={2}>
            {filteredProducts.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <Card className={styles.card}>
                  <CardMedia
                    component="img"
                    image={p.imageUrl || "/default-product.jpg"}
                    alt={p.name}
                    className={styles.cardMedia}
                  />
                  <CardContent className={styles.cardContent}>
                    <Typography variant="h6" className={styles.productName}>{p.name}</Typography>

                    <Box className={styles.ratingBox}>
                      <Rating
                        name={`rating-${p.id}`}
                        value={Number(p.averageRating) || 0}
                        precision={0.5}
                        readOnly
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {p.averageRating ? Number(p.averageRating).toFixed(1) : "0.0"}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 1 }}>
                      {p.discount && p.discount > 0 ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" sx={{ textDecoration: "line-through", color: "#555555" }}>
                            R$ {p.price.toFixed(2)}
                          </Typography>
                          <Typography variant="body1" className={styles.productPriceDiscount}>
                            R$ {(p.price * (1 - p.discount / 100)).toFixed(2)}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography variant="body1" className={styles.productPrice}>
                          R$ {p.price.toFixed(2)}
                        </Typography>
                      )}
                    </Box>

                    {p.storeName && (
                      <Typography
                        variant="body2"
                        className={styles.storeName}
                        onClick={() => window.location.href = `/store/${p.storeId}`}
                      >
                        {p.storeName}
                      </Typography>
                    )}

                    <Typography variant="body2" className={styles.productDescription}>
                      {p.description}
                    </Typography>

                    {p.tags && p.tags.length > 0 && (
                      <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap" }}>
                        {p.tags.map((t, idx) => (
                          <Typography key={t.id || idx} className={styles.tag}>
                            {t.tagName || "Sem nome"}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
};

export { ProductPage };
