import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080", // Change based on your Vite dev server
    supportFile: "cypress/support/commands.ts",
    video: false,
  },
});
