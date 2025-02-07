import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      host: true,
      port: parseInt(env.VITE_PORT) || 5173,
      strictPort: true,
      open: true,
      hmr: { overlay: true },
      watch: { usePolling: true },
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    build: {
      outDir: "dist",  // Ensures build output goes to /dist
      emptyOutDir: true,  // Cleans previous builds
      sourcemap: true,
    },
  };
});
