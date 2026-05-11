import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/oauth2": {
        target: "http://localhost",
        changeOrigin: true,
      },
      "/login": {
        target: "http://localhost",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost",
        changeOrigin: true,
      },
    },
  },
});
