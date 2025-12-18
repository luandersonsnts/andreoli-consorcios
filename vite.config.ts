import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Compatibilidade com ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Configuração única e corrigida
export default defineConfig({
  base: '/', // Caminho base para Vercel (sempre raiz)

  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          // Evita erro com await dentro de array
          (await import("@replit/vite-plugin-cartographer")).cartographer(),
        ]
      : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },

  root: path.resolve(__dirname, "client"),

  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
      // Permitir leitura fora da raiz para aliases externos
      allow: [
        path.resolve(import.meta.dirname, "client"),
        path.resolve(import.meta.dirname, "attached_assets"),
        path.resolve(import.meta.dirname, "shared"),
      ],
      deny: ["**/.*"],
    },
  },
});
