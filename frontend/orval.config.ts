import { defineConfig } from "orval";

export default defineConfig({
  appointmentRequestsApi: {
    input: {
      target: "../backend/swagger/v1/openapi.yaml",
    },
    output: {
      target: "./src/api/generated/endpoints.ts",
      schemas: "./src/api/generated/models",
      client: "react-query",
      mode: "tags-split",
      clean: true,
      mock: true,
      override: {
        mutator: {
          path: "./src/api/client.ts",
          name: "apiClient",
        },
      },
    },
  },
});
