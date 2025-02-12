import { dirname, resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = resolve(__dirname, "public");
const outDir = resolve(__dirname, "dist");

// https://vite.dev/config/
export default defineConfig({
  root,
  plugins: [react()],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        welcome: resolve(root, "index.html"),
        sign_up: resolve(root, "new_user", "index.html"),
      },
    },
  },
});
