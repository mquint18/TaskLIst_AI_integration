import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request to /breakdown gets forwarded to your Express server
      // The browser thinks it's talking to localhost:5173 — no CORS issue
      "/breakdown": "http://localhost:3001",
    },
  },
});
