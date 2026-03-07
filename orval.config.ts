import { defineConfig } from "orval";

export default defineConfig({
  nerveshub: {
    input: {
      target: "./openapi/nerveshub.yaml",
    },
    output: {
      mode: "tags-split",
      target: "./src/api/generated",
      schemas: "./src/api/generated/schemas",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/api/mutator/custom-instance.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useSuspenseQuery: false,
          signal: true,
        },
      },
    },
  },
});
