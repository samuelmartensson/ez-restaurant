// eslint-disable-next-line import/no-anonymous-default-export
export default {
  api: {
    output: {
      prettier: true,
      target: "./src/generated/endpoints.ts",
    },
    input: {
      target: "http://localhost:5232/swagger/v1/swagger.json",
    },
  },
};
