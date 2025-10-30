import { Routes, Route } from "react-router-dom";
import Container from "@mui/material/Container";
import { AdminDashboard, Navbar, ProtectedRoute, Register, Login, UserDashboard, HomePage, Footer } from "./views";

export default function App() {
  return (
     <div className="app-layout">
      <div className="main-content-wrapper">
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="USER">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div>404 - Not Found</div>} />
          </Routes>
        </Container>
      </div>
      <Footer />
    </ div>
  );
}
