import { Typography, Container, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
import styles from "./Footer.module.css";

/**
 *  Footer componente de rodapé do site.
 * @returns  {JSX.Element} componente de rodapé.
 */
const Footer = () => {
  return (
    <Box className={styles.footer}>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          py: 2,
        }}
      >
        <Typography variant="body2" color="inherit" sx={{ fontSize: 14 }}>
          &copy; {new Date().getFullYear()} Loja. Todos os direitos reservados.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link to="/" className={styles.link}>Início</Link>
          <Link to="/about" className={styles.link}>Sobre</Link>
          <Link to="/contact" className={styles.link}>Contato</Link>
        </Box>
        <Box>
          <IconButton
            color="inherit"
            component="a"
            href="https://facebook.com"
            target="_blank"
            aria-label="Facebook"
          >
            <Facebook sx={{ fontSize: 22 }} />
          </IconButton>
          <IconButton
            color="inherit"
            component="a"
            href="https://twitter.com"
            target="_blank"
            aria-label="Twitter"
          >
            <Twitter sx={{ fontSize: 22 }} />
          </IconButton>
          <IconButton
            color="inherit"
            component="a"
            href="https://instagram.com"
            target="_blank"
            aria-label="Instagram"
          >
            <Instagram sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export { Footer };
