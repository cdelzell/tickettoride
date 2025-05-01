import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // ensures build goes into the correct folder for Firebase

    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // if it's coming from src/assets/profile_pics, keep original name:
          if (
            assetInfo.fileName &&
            assetInfo.fileName.startsWith("Profile_Images/")
          ) {
            // assetInfo.name will be like "profile_pics/dw.png"
            const fileName = path.basename(assetInfo.fileName);
            return `assets/Profile_Images/${fileName}`;
          }
          // otherwise use default hash strategy
          return "assets/[name]-[hash][ext]";
        },
      },
    },
  },
});
