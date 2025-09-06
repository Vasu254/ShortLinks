import React from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import ShortenPage from "./pages/ShortenPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import RedirectPage from "./pages/RedirectPage.jsx";
import { LoggerProvider, useLogger } from "./services/logger.js";

function TopBar() {
  const location = useLocation();
  const { log } = useLogger();
  React.useEffect(() => {
    log("NAVIGATE", { pathname: location.pathname });
  }, [location.pathname]);
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AffordMed – URL Shortener
        </Typography>
        <Button component={Link} to="/" color="inherit">Shorten</Button>
        <Button component={Link} to="/stats" color="inherit">Statistics</Button>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <LoggerProvider>
      <TopBar />
      <Container sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<ShortenPage />} />
          <Route path="/shorten" element={<Navigate to="/" replace />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/:code" element={<RedirectPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </LoggerProvider>
  );
}
