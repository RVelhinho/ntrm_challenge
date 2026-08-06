import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    define: {
      __NUTRIUM_API_URL__: JSON.stringify(
        env.VITE_API_URL || (mode === "development" ? "http://localhost:3000" : ""),
      ),
    },
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "./src/app/routes",
        generatedRouteTree: "./src/app/routeTree.gen.ts",
      }),
      react(),
      tailwindcss(),
    ],
    server: {
      port: 5173,
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
    },
  };
});
