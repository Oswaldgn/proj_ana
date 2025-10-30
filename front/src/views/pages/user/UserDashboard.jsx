import { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { UserProfileForm } from "../../components";
import { StoreForm } from "../../components/store/StoreForm";
import styles from "./UserDashboard.module.css";

const UserDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ p: 4 }} className={styles.dashboardContainer}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard do Usuário
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered 
        sx={{ 
            marginBottom: 2,
        }}
      >
          <Tab label="Perfil" />
          <Tab label="Lojas" />
        </Tabs>

      <Box>
        {selectedTab === 0 && (
          <Box>
            <Typography variant="h6" mb={2}>
              Informações do Perfil
            </Typography>
            <UserProfileForm />
          </Box>
        )}

        {selectedTab === 1 && (
          <Box>
            <Typography variant="h6" mb={2}>
              Gerenciar Lojas
            </Typography>
            <StoreForm />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export { UserDashboard };
