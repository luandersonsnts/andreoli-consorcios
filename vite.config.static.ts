import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

// Compatibilidade com ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  base: "/",
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-select', '@radix-ui/react-checkbox', '@radix-ui/react-dialog'],
          icons: ['react-icons']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    'import.meta.env.VITE_STATIC_SITE': JSON.stringify('true')
  }
});
