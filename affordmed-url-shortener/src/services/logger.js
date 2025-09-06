// Simple logger service for the URL shortener app
import { useCallback } from "react";

export function useLogger() {
  const log = useCallback((event, details) => {
    // For now, just print to console
    console.log(`[LOG] ${event}`, details);
  }, []);
  return { log };
}

export function LoggerProvider({ children }) {
  // No-op provider for compatibility
  return children;
}
