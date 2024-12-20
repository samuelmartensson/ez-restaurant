// eslint-disable-next-line import/no-anonymous-default-export
export default {
  api: {
    output: {
      override: {
        mutator: {
          path: "./src/authorized-fetch.ts",
          name: "authorizedFetch",
        },
      },
      client: "react-query",
      prettier: true,
      target: "./src/generated/endpoints.ts",
    },
    input: {
      target: "http://localhost:5232/swagger/v1/swagger.json",
    },
  },
};
