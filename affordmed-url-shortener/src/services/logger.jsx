// src/services/logger.jsx
import React, { createContext, useContext, useState } from "react";

const LogContext = createContext();

export function LogProvider({ children }) {
  const [logs, setLogs] = useState([]);

  const log = (event, details) => {
    const entry = {
      id: Date.now(),
      event,
      details,
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [...prev, entry]);
    console.log("LOGGED EVENT:", entry);
  };

  const clearLogs = () => setLogs([]);

  return (
    <LogContext.Provider value={{ logs, log, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogger() {
  return useContext(LogContext);
}
