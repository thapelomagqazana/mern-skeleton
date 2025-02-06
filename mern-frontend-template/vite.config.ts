/**
 * Vite Configuration File
 *
 * - Loads environment variables
 * - Configures the React plugin with hot reloading (HMR)
 * - Sets up a proxy for API requests
 */

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react({
        fastRefresh: true, // Enables Fast Refresh for React
      }),
    ],
    server: {
      host: true, // Allows access from network
      port: 5173, // Default Vite port
      strictPort: true, // Ensures the selected port is used
      open: true, // Automatically opens in the browser
      hmr: {
        overlay: true, // Shows error overlay on hot reload failure
      },
      watch: {
        usePolling: true, // Ensures changes are detected in some environments (like WSL)
      },
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
        "@": "/src", // Allows using @ as an alias for /src
      },
    },
    build: {
      outDir: "dist", // Output directory for build files
      sourcemap: true, // Generates source maps for debugging
    },
  };
});
