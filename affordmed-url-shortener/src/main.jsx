// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { LogProvider } from "./services/logger.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LogProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LogProvider>
  </React.StrictMode>
);
